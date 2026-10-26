import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Connection } from 'mongoose';

@ApiTags('Health')
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOperation({ summary: 'Liveness + database status (used by uptime pings)' })
  check() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return {
      status: 'ok',
      database: states[this.connection.readyState] ?? 'unknown',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
