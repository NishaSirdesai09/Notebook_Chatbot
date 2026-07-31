import { Global, Module } from '@nestjs/common';
import { LlmConfigService } from './llm-config.service';
import { LlmService } from './llm.service';

@Global()
@Module({
  providers: [LlmConfigService, LlmService],
  exports: [LlmConfigService, LlmService],
})
export class LlmModule {}
