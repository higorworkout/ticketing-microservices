import fs from "fs";

export class KeyStore {
  static getPrivateKey(): string {
    return fs.readFileSync("keys/private.pem", "utf-8");
  }

  static getPublicKey(): string {
    return fs.readFileSync("keys/public.pem", "utf-8");
  }

  static getKeyId(): string {
    return "auth-key-1";
  }
}