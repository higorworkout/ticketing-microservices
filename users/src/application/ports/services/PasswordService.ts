import { PasswordHash } from "../../../domain/value-objects/PasswordHash";

export interface PasswordService {
  hash(raw: string): Promise<PasswordHash>;
  compare(raw: string, hash: PasswordHash): Promise<boolean>;
}
