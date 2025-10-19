import { Injectable, OnModuleInit } from '@nestjs/common';
import { register, collectDefaultMetrics, Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  public readonly contentType = register.contentType;

  private httpRequestsTotal: Counter;
  private httpRequestDuration: Histogram;

  onModuleInit() {
    // Collect default metrics (CPU, memory, etc.)
    collectDefaultMetrics({ register });

    // Custom metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [register],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      registers: [register],
    });
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  incrementHttpRequests(method: string, route: string, status: number) {
    this.httpRequestsTotal.inc({ method, route, status: status.toString() });
  }

  observeHttpDuration(method: string, route: string, status: number, duration: number) {
    this.httpRequestDuration.observe(
      { method, route, status: status.toString() },
      duration,
    );
  }
}
