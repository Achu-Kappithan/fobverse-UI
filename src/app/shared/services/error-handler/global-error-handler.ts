import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: unknown): void {
    const logger = this.injector.get<LoggerService>(LoggerService);
    const toast = this.injector.get<ToastService>(ToastService);

    let message = 'An unexpected error occurred';
    let stackTrace = '';

    try {
      if (error instanceof HttpErrorResponse) {
        message = error.error?.message || error.message || 'Server connection failed';
        logger.error(`[Server Error ${error.status}]: ${message}`, error);
      } else if (error instanceof Error) {
        message = error.message;
        stackTrace = error.stack || '';
        logger.error(`[Client Error]: ${message}`, { stackTrace, error });
      } else if (error && typeof error === 'object' && 'message' in error) {
        message = (error as { message: string }).message;
        logger.error(`[Client Error]: ${message}`, { error });
      } else {
        message = error ? String(error) : 'Unknown error';
        logger.error(`[Client Error]: ${message}`, { error });
      }

      toast.error('Application Error', message);
    } catch (handlerError) {
      console.error('Critical failure in GlobalErrorHandler:', handlerError);
    }
  }
}
