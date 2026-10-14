import { Role } from '../../users/schemas/user.schema.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}