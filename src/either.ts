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
}
