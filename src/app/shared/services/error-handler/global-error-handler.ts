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

    if (error instanceof HttpErrorResponse) {
      // Server error
      message = error.error?.message || error.message || 'Server connection failed';
      logger.error(`[Server Error ${error.status}]: ${message}`, error);
    } else if (error instanceof Error) {
      // Client error (Standard Error)
      message = error.message;
      stackTrace = error.stack || '';
      logger.error(`[Client Error]: ${message}`, { stackTrace, error });
    } else {
      // Other error types
      message = error ? String(error) : 'Unknown error';
      logger.error(`[Client Error]: ${message}`, { error });
    }

    // Notify user via Toast
    toast.error('Application Error', message);
  }
}
