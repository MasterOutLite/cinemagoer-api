import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthDto } from "@src/auth/dto/auth.dto";
import { AuthService } from "@src/auth/auth.service";
import { CreateUserDto } from "@models/users/dto/create-user.dto";
import { PossiblyJwtAuthGuard } from "@src/guard/possibly-jwt-auth-guard";
import { RoleUser } from "@src/const/role";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {

  constructor(
    private authService: AuthService
  ) {
  }

  @Post("login")
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post("registration")
  @ApiBearerAuth("JWT")
  @UseGuards(PossiblyJwtAuthGuard)
  registration(@Body() dto: CreateUserDto, @Req() req: any) {
    console.log("User", req.user);
    let hasAdmin = false;
    if (req.user)
      hasAdmin = req.user.roles.includes(RoleUser.ADMIN);
    console.log("Auth:", hasAdmin);
    return this.authService.registration(dto, hasAdmin);
  }
}
