# Task Tracker – API Reference

**Base URL:** `https://<your-backend-domain>` (local: `http://localhost:3000`)

All request/response bodies are `application/json`. All task endpoints require a valid `Authorization: Bearer <accessToken>` header.

---

## Authentication

### CSRF Flow

Before making any auth request that requires CSRF protection, call `GET /auth/csrf-token` to obtain a token. The backend sets an `HttpOnly` cookie (`csrfSecret`) and returns the signed token in the response body. On `POST /auth/refresh` and `POST /auth/logout`, send the stored token as the `X-CSRF-Token` header.

---

### `POST /auth/register`

Create a new user account.

**Request body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `email` | string | ✓ | Valid email format |
| `password` | string | ✓ | Min 6 characters |
| `name` | string | ✓ | Min 2 characters, HTML-sanitized |

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "Jane Doe"
}
```

**Response `201`:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe"
}
```

**Error responses:** `400` validation failure, `409` email already in use.

---

### `POST /auth/login`

Authenticate and receive tokens.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `email` | string | ✓ |
| `password` | string | ✓ |

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response `200`:**

```json
{
  "accessToken": "<JWT, 15 min TTL>",
  "csrfToken": "<HMAC-SHA256 signed token>",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

**Cookies set:**

| Name | Type | Path | TTL |
|---|---|---|---|
| `refreshToken` | HttpOnly, Secure, SameSite=Strict | `/auth` | 7 days |
| `csrfSecret` | HttpOnly, Secure, SameSite=Strict | `/auth` | 7 days |

**Error responses:** `400` validation failure, `401` invalid credentials.

---

### `GET /auth/csrf-token`

Issue a fresh CSRF secret. Call on application load before any CSRF-protected request.

**No request body.**

**Response `200`:**

```json
{
  "csrfToken": "<HMAC-SHA256 signed token>"
}
```

**Cookie set:** `csrfSecret` (HttpOnly, Secure, SameSite=Strict, path `/auth`, 7 days).

---

### `POST /auth/refresh`

Exchange a valid refresh token cookie for new access and CSRF tokens. No request body needed — the `refreshToken` cookie is sent automatically.

**Required header:**

```
X-CSRF-Token: <csrfToken from login or csrf-token response>
```

**Response `200`:**

```json
{
  "accessToken": "<new JWT, 15 min TTL>",
  "csrfToken": "<new HMAC-SHA256 signed token>"
}
```

**Cookies rotated:** both `refreshToken` and `csrfSecret` are reissued with fresh 7-day TTLs.

**Error responses:** `401` missing or invalid refresh token / CSRF token.

---

### `POST /auth/logout`

Invalidate the session by clearing the refresh token and CSRF secret cookies.

**Required header:**

```
X-CSRF-Token: <csrfToken>
```

**Response `204` (No Content).** Cookies `refreshToken` and `csrfSecret` are cleared.

**Error responses:** `403` CSRF token mismatch.

---

## Tasks

All task endpoints require:

```
Authorization: Bearer <accessToken>
```

Users can only access and modify their own tasks. Attempting to read or modify another user's task returns `403`.

---

### `GET /tasks`

Retrieve all tasks belonging to the authenticated user.

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "userId": "uuid",
    "createdAt": "2026-04-27T10:00:00.000Z",
    "updatedAt": "2026-04-27T10:00:00.000Z"
  }
]
```

Returns an empty array `[]` if the user has no tasks.

---

### `POST /tasks`

Create a new task.

**Request body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | ✓ | Min 3 characters, HTML-sanitized |
| `description` | string | — | Optional, HTML-sanitized |
| `completed` | boolean | — | Default `false` |

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Response `201`:**

```json
{
  "id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "userId": "uuid",
  "createdAt": "2026-04-27T10:00:00.000Z",
  "updatedAt": "2026-04-27T10:00:00.000Z"
}
```

**Error responses:** `400` validation failure, `401` not authenticated.

---

### `GET /tasks/:id`

Retrieve a single task by ID.

**Path parameter:** `id` — UUID of the task.

**Response `200`:** Same shape as an item in `GET /tasks`.

**Error responses:** `401` not authenticated, `403` task belongs to another user, `404` task not found.

---

### `PUT /tasks/:id`

Update a task. All fields are optional — only provided fields are updated.

**Path parameter:** `id` — UUID of the task.

**Request body:**

| Field | Type | Constraints |
|---|---|---|
| `title` | string | Min 3 characters, HTML-sanitized |
| `description` | string | HTML-sanitized |
| `completed` | boolean | — |

```json
{
  "completed": true
}
```

**Response `200`:** Updated task object (same shape as `GET /tasks/:id`).

**Error responses:** `400` validation failure, `401` not authenticated, `403` task belongs to another user, `404` task not found.

---

### `DELETE /tasks/:id`

Delete a task permanently.

**Path parameter:** `id` — UUID of the task.

**Response `200`:**

```json
{
  "message": "Task deleted successfully"
}
```

**Error responses:** `401` not authenticated, `403` task belongs to another user, `404` task not found.

---

## Error Response Format

All errors follow a consistent envelope:

```json
{
  "statusCode": 400,
  "message": "Title must be at least 3 characters",
  "error": "Bad Request",
  "timestamp": "2026-04-27T10:00:00.000Z",
  "path": "/tasks"
}
```

Validation errors return `message` as an array of strings. In production, `500` errors return a generic `"Internal server error"` message with no stack trace.

---

## Rate Limiting

All endpoints are protected by a global throttler: **5 requests per 15 seconds per IP**. Exceeding this returns `429 Too Many Requests`.

---

## CORS

The API only accepts requests from origins specified in the `CORS_ORIGIN` environment variable. Credentials (`withCredentials: true`) are required for cookie-based auth to function correctly.
