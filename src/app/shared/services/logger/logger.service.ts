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

    console.warn(`[WARN]: ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {

    console.error(`[ERROR]: ${message}`, ...args);
  }
}
