export interface TokenService {
  generateAccessToken(payload: {
    userId: string;
    email: string;
  }): string;

  generateRefreshToken(payload: {
    userId: string;
  }): string;
}