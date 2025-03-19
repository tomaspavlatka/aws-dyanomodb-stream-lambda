export class Either<L, R> {
  private constructor(
    private readonly leftValue?: L,
    private readonly rightValue?: R,
  ) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>(value, undefined);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>(undefined, value);
  }

  bind<T>(fn: (value: R) => Either<L, T>): Either<L, T> {
    if (this.isRight()) {
      return fn(this.rightValue!);
    }
    return Either.left(this.leftValue!);
  }

  async bindAsync<T>(
    fn: (value: R) => Promise<Either<L, T>>,
  ): Promise<Either<L, T>> {
    if (this.isRight()) {
      return fn(this.rightValue!);
    }
    return Promise.resolve(Either.left(this.leftValue!));
  }

  isLeft(): boolean {
    return this.leftValue !== undefined;
  }

  isRight(): boolean {
    return this.rightValue !== undefined;
  }

  getLeft(): L {
    return this.leftValue!;
  }

  getRight(): R {
    return this.rightValue!;
  }

  mapRight<T>(fn: (value: R) => T): Either<L, T> {
    if (this.isRight()) {
      return Either.right(fn(this.rightValue!));
    }
    return Either.left(this.leftValue!);
  }

  mapLeft<T>(fn: (value: L) => T): Either<T, R> {
    if (this.isLeft()) {
      return Either.left(fn(this.leftValue!));
    }
    return Either.right(this.rightValue!);
  }

  mapLeftToRight<T>(fn: (value: L) => T): Either<never, R | T> {
    if (this.isLeft()) {
      return Either.right(fn(this.leftValue!)); // Map Left to Right
    }
    return Either.right(this.rightValue!); // Keep Right as-is
  }

  mapRightToLeft<T>(fn: (value: R) => T): Either<L | T, never> {
    if (this.isRight()) {
      return Either.left(fn(this.rightValue!)); // Map Right to Left
    }
    return Either.left(this.leftValue!); // Keep Left as-is
  }

  static isEither(obj: any): obj is Either<any, any> {
    return obj instanceof Either;
  }

  flip(): Either<R, L> {
    if (this.isRight()) {
      return Either.left(this.rightValue!); // Right becomes Left
    }

    return Either.right(this.leftValue!); // Left becomes Right
  }
}
