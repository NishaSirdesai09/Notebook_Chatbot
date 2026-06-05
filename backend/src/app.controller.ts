import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'notebook-chatbot-api', time: new Date().toISOString() };
  }
}
