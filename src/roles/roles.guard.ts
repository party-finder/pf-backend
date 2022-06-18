import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])
            if (!requiredRoles) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authHeader: string = req.headers.token;
            const bearer: string = authHeader.split(" ")[0];
            const token: string = authHeader.split(" ")[1];

            if (bearer !== "bearer" || !token) {
                throw new UnauthorizedException({ message: "Пользователь не авторизован" });
            }

            const user = this.jwtService.verify(token, {
                secret: process.env.SECRET,
            });
            req.user = user;
            return user.roles.some(role => requiredRoles.includes(role.value));
        } catch (err) {
            throw new ForbiddenException({ message: "Нет доступа" });
        }
    }
}