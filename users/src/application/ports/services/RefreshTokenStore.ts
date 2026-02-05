export interface RefreshTokenStore {
  save(tokenId: string, userId: string): Promise<void>;
  validate(tokenId: string): Promise<boolean>;
  revoke(tokenId: string): Promise<void>;
}