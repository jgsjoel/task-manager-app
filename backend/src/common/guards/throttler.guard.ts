import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Custom ThrottlerGuard that can be used to rate limit endpoints
 * Usage: @UseGuards(ThrottlerGuard) on controller methods
 * or globally in app.module.ts
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use IP address as the tracker for rate limiting
    return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'default';
  }
}
