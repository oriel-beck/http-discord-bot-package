export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError"
    }
}

export class IncorrectTypeError extends TypeError {
    constructor(arg: string, type: string, received: string) {
        super(`Expected \"${arg}\" to be type of \"${type}\", received type of \"${received}\"`);
    }
}