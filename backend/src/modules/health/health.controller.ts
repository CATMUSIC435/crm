import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health & Observability')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Kiểm tra trạng thái tổng thể hệ thống (Database, Redis, RAM)' })
  @ApiResponse({ status: 200, description: 'Hệ thống vận hành bình thường' })
  async getOverallHealth() {
    return await this.healthService.checkOverall();
  }

  @Get('liveness')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kubernetes Liveness Probe (Kiểm tra Process sống)' })
  getLiveness() {
    return this.healthService.checkLiveness();
  }

  @Get('readiness')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kubernetes Readiness Probe (Kiểm tra sẵn sàng tiếp nhận traffic)' })
  async getReadiness() {
    return await this.healthService.checkReadiness();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Chỉ số hiệu năng Process & Telemetry' })
  getMetrics() {
    return this.healthService.getMetrics();
  }
}
