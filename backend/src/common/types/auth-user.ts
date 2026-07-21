export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'Student' | 'Professor' | 'Admin';
};

export type JwtPayload = {
  sub: string;
  email: string;
};
