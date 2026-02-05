import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";
import { randomUUID } from "crypto";

export class GetOrCreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: { sub: string; email: string }) {
    let user = await this.userRepo.findByCognitoSub(input.sub);

    if (!user) {
      user = User.create({
        id: randomUUID(),
        cognitoSub: input.sub,
        email: input.email,
        role: "USER",
        permissions: []
      });

      user = await this.userRepo.create(user);
    }

    return user;
  }
}