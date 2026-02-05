import { UserIdentity } from "../../../domain/entities/user.entity";
import { AuthProvider } from "../../../domain/enums/AuthProvider";

export interface UserIdentityRepository {
  findByProvider(
    provider: AuthProvider,
    providerId: string
  ): Promise<UserIdentity | null>;

  save(identity: UserIdentity): Promise<void>;
}