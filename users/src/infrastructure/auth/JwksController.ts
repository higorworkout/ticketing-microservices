import { Request, Response } from "express";

export class JwksController {
  static getKeys(req: Request, res: Response) {
    res.json({
      keys: [
        {
          kty: "RSA",
          use: "sig",
          kid: "auth-key-1",
          alg: "RS256",
          n: process.env.JWK_N!,
          e: "AQAB"
        }
      ]
    });
  }
}