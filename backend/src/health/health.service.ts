import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private redisService: RedisService,
  ) {}

  async check() {
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'unknown',
        redis: 'unknown',
      },
    };

    // Check database
    try {
      await this.userRepository.query('SELECT 1');
      status.services.database = 'healthy';
    } catch (error) {
      status.services.database = 'unhealthy';
      status.status = 'degraded';
    }

    // Check Redis
    try {
      await this.redisService.set('health_check', 'ok', 5);
      const result = await this.redisService.get('health_check');
      status.services.redis = result === 'ok' ? 'healthy' : 'unhealthy';
    } catch (error) {
      status.services.redis = 'unhealthy';
      status.status = 'degraded';
    }

    return status;
  }
}
