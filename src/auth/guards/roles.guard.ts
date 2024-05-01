import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { StoreService } from 'src/stores/store.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private storeService: StoreService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException();
    const decoded = this.jwtService.decode(token);
    const storeId = decoded.sub;
    const role = await this.storeService.getStoreRoleById(storeId);

    return roles.includes(role);
  }
}
