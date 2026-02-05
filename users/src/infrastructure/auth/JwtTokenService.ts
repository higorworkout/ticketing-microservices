import jwt from "jsonwebtoken";
import { KeyStore } from "./KeyStore";
import { TokenService } from "../../application/ports/services/TokenService";

export class JwtTokenService implements TokenService {
    generateAccessToken(payload: {
        userId: string;
        email: string;
    }): string {
        return jwt.sign(
            {
                sub: payload.userId,
                email: payload.email,
                scope: "user",
                iss: "https://auth.seudominio.com",
                aud: "api-client-id"
            },
            KeyStore.getPrivateKey(),
            {
                algorithm: "RS256",
                expiresIn: "15m",
                keyid: KeyStore.getKeyId()
            }
        );
    }

    generateRefreshToken(payload: {
        userId: string;
    }): string {
        return jwt.sign(
        {
            sub: payload.userId,
            iss: "https://auth.seudominio.com",
            aud: "refresh-client"
        },
        KeyStore.getPrivateKey(),
        {
            algorithm: "RS256",
            expiresIn: "7d",
            keyid: KeyStore.getKeyId()
        }
        );
    }
}