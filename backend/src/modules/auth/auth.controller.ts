import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @HttpCode(200)
  logout() {
    return this.authService.logout();
  }
}
