import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { TokenTypeEnum } from "src/common/enums/token.enum";
import { RoleEnum } from "src/common/enums/user.enums";
import { AuthGuard } from "./../guard/authentication.guard";
import { Authoriaztionuard } from "./../guard/authorization.guard";

export function Auth({
  tokenType = TokenTypeEnum.access,
  roles = [RoleEnum.User, RoleEnum.Admin],
}: {
  tokenType?: TokenTypeEnum;
  roles?: RoleEnum[];
}) {
  return applyDecorators(
    SetMetadata("tokenType", tokenType),
    SetMetadata("Roles", roles),
    UseGuards(AuthGuard, Authoriaztionuard),
  );
}
