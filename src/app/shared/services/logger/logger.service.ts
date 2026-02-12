import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  log(message: string, ...args: unknown[]): void {
    if (isDevMode()) {
       
      console.log(`[LOG]: ${message}`, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (isDevMode()) {
      console.debug(`[DEBUG]: ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (isDevMode()) {
      console.info(`[INFO]: ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    // Warnings are kept even in prod but can be filtered or sent to monitoring
    console.warn(`[WARN]: ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    // Errors are always logged
    console.error(`[ERROR]: ${message}`, ...args);
  }
}
