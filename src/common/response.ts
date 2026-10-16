import { ErrorResponse } from './error';

/**
 * Padrão de retorno discriminado inspirado no Resend (Data ou Error)
 */
export type LumiResponse<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: ErrorResponse;
    };
