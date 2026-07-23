import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { SettingsService, UserPreferenceDto } from './settings.service';

@Controller('preferences')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('me')
  get(@CurrentUser() user: AuthUser) {
    return this.settingsService.getPreferences(user.id);
  }

  @Patch('me')
  update(@CurrentUser() user: AuthUser, @Body() dto: UserPreferenceDto) {
    return this.settingsService.updatePreferences(user.id, dto);
  }
}
