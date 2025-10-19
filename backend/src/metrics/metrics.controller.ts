import { Controller, Get, Response } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(@Response() res) {
    const metrics = await this.metricsService.getMetrics();
    res.set('Content-Type', this.metricsService.contentType);
    res.send(metrics);
  }
}
