export class IncorrectTypeError extends TypeError {
  constructor(arg: string, type: string, received: string) {
    super(`Expected "${arg}" to be type of "${type}", received type of "${received}"`);
  }
}
