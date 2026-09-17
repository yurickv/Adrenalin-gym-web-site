export class BadRequest extends Error {
  private status;
  constructor(message: string) {
    super(message);
    this.status = 400;
    this.message = message;
  }
}

export class NotFound extends Error {
  private status;
  constructor(message: string) {
    super(message);
    this.status = 404;
    this.message = message;
  }
}

export class Unauthorized extends Error {
  private status;
  constructor(message: string) {
    super(message);
    this.status = 401;
    this.message = message;
  }
}

export class Forbidden extends Error {
  private status;
  constructor(message: string) {
    super(message);
    this.status = 403;
    this.message = message;
  }
}

export class Conflict extends Error {
  private status;
  constructor(message: string) {
    super(message);
    this.status = 409;
    this.message = message;
  }
}

export class InternalError extends Error {
  private status;
  constructor(message: string) {
    super(message);
    this.status = 500;
    this.message = message;
  }
}
