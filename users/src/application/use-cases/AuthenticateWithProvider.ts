import { User } from "../../domain/entities/User";
import { UserIdentity } from "../../domain/entities/user.entity";
import { AuthProvider } from "../../domain/enums/AuthProvider";
import { Email } from "../../domain/value-objects/Email";
import { IdGenerator } from "../ports/IdGenerator";
import { UserIdentityRepository } from "../ports/repositories/UserIdentityRepository";
import { UserRepository } from "../ports/repositories/UserRepository";
import { TokenService } from "../ports/services/TokenService";

export class AuthenticateWithProvider {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly identityRepo: UserIdentityRepository,
        private readonly tokenService: TokenService,
        private readonly idGenerator: IdGenerator
    ) {}

    async execute(input: {
        provider: AuthProvider;
        providerId: string;
        email: string;
    }) {

        let identity = await this.identityRepo.findByProvider(
            input.provider,
            input.providerId
        );

        let user: User | null = null;

        if (!identity) {
            const email = Email.create(input.email);

            const userId = this.idGenerator.generate();

            user = User.create({
                id: userId,
                email
            });

            const credentialId = this.idGenerator.generate();

             identity = UserIdentity.create({
                id: credentialId,
                userId: user.id,
                provider: input.provider,
                providerId: input.providerId
            });

            await this.userRepo.save(user);
            await this.identityRepo.save(identity);
        } else {
            user = await this.userRepo.findById(identity.userId);
            if (!user) throw new Error("User not found");
        }

        return {
            accessToken: this.tokenService.generateAccessToken({
                userId: user.id,
                email: user.email.value
            })
        };
  }
}