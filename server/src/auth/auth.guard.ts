import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "./public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService, 
        private reflector: Reflector, // used to find which routes are marked public
    ) {}

    // verifies jwt and determines if request should proceed
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // if public route, skip auth check and allow request
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        
        // executionContext wraps request with details like what kind of req (http/websocket/rpc), where it's going (which controller method)
        // needed for reflector - gets metadata (@Public tag) before code runs
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException("No token provided");
        }

        try {
            // can pass secret explicitly here if we have multiple. just one for now so using global.
            const payload = await this.jwtService.verifyAsync(token);
            request["user"] = payload; // assign payload to req obj for later access
        } catch {
            throw new UnauthorizedException("Invalid token");
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
