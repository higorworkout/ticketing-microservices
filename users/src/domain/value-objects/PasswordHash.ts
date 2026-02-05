export class PasswordHash {
  private constructor(public readonly value: string) {}

  static create(hash: string): PasswordHash {
    if (!hash || hash.length < 20) {
      throw new Error("Invalid password hash");
    }

    return new PasswordHash(hash);
  }
}