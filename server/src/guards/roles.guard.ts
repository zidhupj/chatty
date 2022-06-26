import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, ROLES_KEY } from "src/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (!roles || roles.includes(Role.Public)) {
            return true;
        }
        const userCred = context.switchToHttp().getRequest().userCred;
        console.log("here", userCred);
        if (!userCred) return false;

        if (roles.includes(userCred.role)) {
            return true;
        }
        return false;
    }
}