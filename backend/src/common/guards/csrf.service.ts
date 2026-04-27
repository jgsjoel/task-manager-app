import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CsrfService {
  // Use a cryptographically secure random string for the salt/secret
  private readonly CSRF_SECRET = process.env.CSRF_SECRET;

  // Generate a random "Secret" to be stored in the HttpOnly Cookie
  generateCookieSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate the Token to be sent in the JSON body
  // We sign the cookieSecret so we can verify it later
  generateToken(cookieSecret: string): string {
    return crypto
      .createHmac('sha256', this.CSRF_SECRET!)
      .update(cookieSecret)
      .digest('hex');
  }

  validateToken(cookieSecret: string, token: string): boolean {
    if (!cookieSecret || !token) return false;

    const expectedToken = this.generateToken(cookieSecret);
    
    const tokenBuffer = Buffer.from(token);
    const expectedBuffer = Buffer.from(expectedToken);

    if (tokenBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
  }
}