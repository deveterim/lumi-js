export interface ErrorResponse {
  message: string;
  name: string;
  statusCode?: number;
}

export class LumiError extends Error {
  readonly statusCode?: number;
  readonly type: string;

  constructor(message: string, statusCode?: number, type = 'lumi_error') {
    super(message);
    this.name = 'LumiError';
    this.statusCode = statusCode;
    this.type = type;
    Object.setPrototypeOf(this, LumiError.prototype);
  }
}
