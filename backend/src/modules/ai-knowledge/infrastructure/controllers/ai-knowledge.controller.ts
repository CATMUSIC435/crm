import { Controller, Get, Post, Query, Body, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AI_KNOWLEDGE_USE_CASE, AiKnowledgeUseCase } from '../../application/ports/in/ai-knowledge.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Trợ Lý AI Tri Thức & RAG Hỏi Đáp BĐS (AI-Knowledge)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/ai-knowledge')
export class AiKnowledgeController {
  constructor(
    @Inject(AI_KNOWLEDGE_USE_CASE)
    private readonly aiKnowledgeUseCase: AiKnowledgeUseCase,
  ) {}

  @Post('ask')
  @ApiOperation({ summary: 'Hỏi đáp nghiệp vụ với Trợ lý AI Bất Động Sản (RAG Semantic Search)' })
  async ask(@Body() body: { question: string; projectId?: string }) {
    return await this.aiKnowledgeUseCase.ask(body);
  }

  @Get('documents')
  @ApiOperation({ summary: 'Danh mục tài liệu chính sách bán hàng, brochure và pháp lý' })
  @ApiQuery({ name: 'category', required: false })
  async getDocuments(@Query('category') category?: any) {
    return await this.aiKnowledgeUseCase.getDocuments(category);
  }

  @Post('documents')
  @ApiOperation({ summary: 'Thêm tài liệu chính sách mới vào kho tri thức vector' })
  async createDocument(@Body() body: any) {
    return await this.aiKnowledgeUseCase.createDocument(body);
  }
}
