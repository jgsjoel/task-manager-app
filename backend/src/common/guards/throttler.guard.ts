import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

// Custom throttler guard to use IP address for rate limiting instead of default key
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use IP address as the tracker for rate limiting
    return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'default';
  }
}
