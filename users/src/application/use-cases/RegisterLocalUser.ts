import { User } from "../../domain/entities/User";
import { UserCredential } from "../../domain/entities/UserCredential";
import { Email } from "../../domain/value-objects/Email";
import { IdGenerator } from "../ports/IdGenerator";
import { UserCredentialRepository } from "../ports/repositories/UserCredentialRepository";
import { UserRepository } from "../ports/repositories/UserRepository";
import { PasswordService } from "../ports/services/PasswordService";



export class RegisterLocalUser {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly credentialRepo: UserCredentialRepository,
    private readonly passwordService: PasswordService,
    private readonly idGenerator: IdGenerator
  ) {}
 async execute(input: {
    email: string;
    password: string;
  }) {
    const email = Email.create(input.email);

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const userId = this.idGenerator.generate();
    const credentialId = this.idGenerator.generate();

    const user = User.create({
      id: userId,
      email
    });

    const passwordHash = await this.passwordService.hash(input.password);

    const credential = UserCredential.create({
      id: credentialId,
      userId: user.id,
      passwordHash
    });

    await this.userRepo.save(user);
    await this.credentialRepo.save(credential);

    return { userId: user.id };
  }
}