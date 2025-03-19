import { Either } from "./either";
import { ContextAwareException } from "./exceptions/context-aware.exception";
import { MissingValueException } from "./exceptions/missing-value.exception";

export class Config {
  static get(key: string): Either<ContextAwareException, string> {
    const value = process.env[key];

    return value === undefined
      ? Either.left(MissingValueException.create(`config:${key}`, ""))
      : Either.right(value);
  }
}
