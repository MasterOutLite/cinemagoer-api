import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { TokenFormat } from "@src/auth/dto/TokenFormat";

@Injectable()
export class PossiblyJwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
  ) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log();
    const req = context.switchToHttp().getRequest();
    try {
      console.log("PossiblyJwtAuthGuard:", "Start verify");
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      console.log("PossiblyJwtAuthGuard:", token);
      req.user = this.jwtService.verify(token) as TokenFormat;
    } catch (e) {
      console.log("PossiblyJwtAuthGuard exception:", e);
    }
    return true;
  }
}
