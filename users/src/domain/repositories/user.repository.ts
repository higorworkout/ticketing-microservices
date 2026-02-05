import { User } from "../entities/user.entity";

export interface UserRepository {
  findByCognitoSub(cognitoSub: string): Promise<User | null>;
  create(user: User): Promise<User>;
}