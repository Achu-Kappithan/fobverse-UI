import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const logger = this.injector.get<LoggerService>(LoggerService);
    const toast = this.injector.get<ToastService>(ToastService);

    let message = 'An unexpected error occurred';
    let stackTrace = '';

    if (error instanceof HttpErrorResponse) {
      // Server error
      message = error.error?.message || error.message || 'Server connection failed';
      logger.error(`[Server Error ${error.status}]: ${message}`, error);
    } else {
      // Client error
      message = error.message ? error.message : error.toString();
      stackTrace = error.stack ? error.stack : '';
      logger.error(`[Client Error]: ${message}`, { stackTrace, error });
    }

    // Notify user via Toast
    toast.error('Application Error', message);
    
    // In many industrial apps, here you would also send the error to a logging service like Sentry or LogRocket
  }
}
