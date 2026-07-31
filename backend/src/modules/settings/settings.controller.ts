import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { SettingsService, UserSettingsDto } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('llm/catalog')
  catalog() {
    return this.settingsService.listLlmCatalog();
  }

  @Get(':userId')
  get(@Param('userId') userId: string) {
    return this.settingsService.getSettings(userId);
  }

  @Patch(':userId')
  update(@Param('userId') userId: string, @Body() dto: UserSettingsDto) {
    return this.settingsService.updateSettings(userId, dto);
  }
}
