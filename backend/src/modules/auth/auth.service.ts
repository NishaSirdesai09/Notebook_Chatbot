import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuthResult, User } from '../../common/types';
import { LoginDto, SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  // In-memory user store — replace with a PostgreSQL repository.
  private readonly users = new Map<string, User & { password: string }>();

  signup(dto: SignupDto): AuthResult {
    const user: User & { password: string } = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      role: dto.role,
      password: dto.password, // TODO: hash with bcrypt/argon2 in production
    };
    this.users.set(dto.email, user);
    return this.result(user);
  }

  login(dto: LoginDto): AuthResult {
    const existing = this.users.get(dto.email);
    // Demo behavior: accept any credentials, returning a stub user if unknown.
    const user: User & { password: string } =
      existing ?? {
        id: randomUUID(),
        name: dto.email.split('@')[0],
        email: dto.email,
        role: 'Student',
        password: dto.password,
      };
    if (existing && existing.password !== dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.result(user);
  }

  logout(): { success: boolean } {
    // Stateless JWT logout is handled client-side; revoke tokens here if needed.
    return { success: true };
  }

  private result(user: User & { password: string }): AuthResult {
    const { password: _password, ...safe } = user;
    void _password;
    return {
      user: safe,
      // TODO: sign a real JWT with @nestjs/jwt using JWT_SECRET.
      accessToken: `mock.jwt.${user.id}`,
    };
  }
}
