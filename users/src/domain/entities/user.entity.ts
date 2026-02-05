
export type UserRole = "USER" | "ADMIN";

export class User {
  private constructor(
    public readonly id: string,
    public readonly cognitoSub: string,
    public email: string,
    public role: UserRole,
    public permissions: string[]
  ) {}

  static create(params: {
    id: string;
    cognitoSub: string,
    email: string,
    role: UserRole,
    permissions: string[]
  }): User {
    return new User(
      params.id,
      params.cognitoSub,
      params.email,
      params.role,
      params.permissions
    );
  }
}