import { RefreshTokenStore } from "../ports/services/RefreshTokenStore";
import { TokenService } from "../ports/services/TokenService";



export class RefreshAccessToken {
    constructor(
        private readonly tokenService: TokenService,
        private readonly refreshStore: RefreshTokenStore
  ) {}

   async execute(input: {
    refreshTokenId: string;
    userId: string;
  }) {
    const valid = await this.refreshStore.validate(input.refreshTokenId);
    if (!valid) throw new Error("Invalid refresh token");

    return {
      accessToken: this.tokenService.generateAccessToken({
        userId: input.userId,
        email: "" // normalmente recuperado do userRepo
      })
    };
  }
}