import { UserCredential } from "../../../domain/entities/UserCredential";

export interface UserCredentialRepository {
  findByUserId(userId: string): Promise<UserCredential | null>;
  save(credential: UserCredential): Promise<void>;
}