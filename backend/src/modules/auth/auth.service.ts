import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthResult, User } from '../../common/types';
import { LlmConfigService } from '../llm/llm-config.service';
import { LoginDto, SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmConfig: LlmConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('An account with this email already exists');

    const defaults = this.llmConfig.resolveDefaultModel();
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: dto.password, // TODO: hash in production
        role: dto.role,
        settings: {
          create: {
            llmProviderId: defaults.providerId,
            llmModelId: defaults.modelId,
          },
        },
      },
    });

    return this.result(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || user.password !== dto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.result(user);
  }

  logout(): { success: boolean } {
    return { success: true };
  }

  private result(user: { id: string; name: string; email: string; role: string }): AuthResult {
    const safe: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as User['role'],
    };
    return {
      user: safe,
      accessToken: `token.${user.id}`,
    };
  }
}
