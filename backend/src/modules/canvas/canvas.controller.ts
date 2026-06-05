import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { ConnectCanvasDto, SyncCanvasDto } from './dto/canvas.dto';

@Controller('canvas')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @Post('connect')
  @HttpCode(200)
  connect(@Body() dto: ConnectCanvasDto) {
    return this.canvasService.connect(dto);
  }

  @Get('courses')
  courses() {
    return this.canvasService.courses();
  }

  @Post('sync')
  @HttpCode(200)
  sync(@Body() dto: SyncCanvasDto) {
    return this.canvasService.sync(dto);
  }
}
