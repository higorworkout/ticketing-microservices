import crypto from "crypto";
import { IdGenerator } from "../../ports/IdGenerator";

export class UUIDGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}