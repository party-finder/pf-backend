import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader: string = req.headers.token
            const bearer: string = authHeader.split(" ")[0];
            const token: string = authHeader.split(" ")[1]

            if (bearer !== "bearer" || !token) {
                throw new UnauthorizedException({ message: "Пользователь не авторизован" })
            }

            const user = this.jwtService.verify(token, {
                secret: process.env.SECRET
            })
            req.user = user;
            return true;

        } catch (err) {
            throw new UnauthorizedException({ message: "Пользователь не авторизован" })
        }
    }
}