import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SweetAlert {

  constructor() { }

  /**
       * Shows a success notification (toast style).
       * @param title The title of the success message.
       * @param text Optional text for the message.
       * @param timer Optional duration for auto-dismissal (defaults to 3000ms).
       */
showSuccessToast(title: string, text: string = '', timer: number = 7000): void {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: timer,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: 'custom-border-toast',
      title: 'custom-toast-title',
      icon: 'custom-toast-icon'
    },
    backdrop: false
  });
}

      /**
       * Shows an error notification (toast style).
       * @param title The title of the error message.
       * @param text Optional text for the message.
       * @param timer Optional duration for auto-dismissal (defaults to 5000ms).
       */
      showErrorToast(title: string, text: string = '', timer: number = 5000): void {
        Swal.fire({
          icon: 'error',
          title: title,
          text: text,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: timer,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
      }

      /**
       * Shows an info notification (toast style).
       * @param title The title of the info message.
       * @param text Optional text for the message.
       * @param timer Optional duration for auto-dismissal (defaults to 3000ms).
       */
      showInfoToast(title: string, text: string = '', timer: number = 3000): void {
        Swal.fire({
          icon: 'info',
          title: title,
          text: text,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: timer,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
      }

      /**
       * Shows a generic alert dialog (modal style).
       * @param icon The icon for the alert ('success', 'error', 'warning', 'info', 'question').
       * @param title The title of the alert.
       * @param text The main text content of the alert.
       * @returns A Promise that resolves when the alert is closed.
       */
      showAlert(icon: SweetAlertIcon, title: string, text: string): Promise<SweetAlertResult> {
        return Swal.fire({
          icon: icon,
          title: title,
          text: text,
          confirmButtonText: 'OK',
          allowOutsideClick: false, // Prevent closing by clicking outside
          allowEscapeKey: false, // Prevent closing with Escape key
        });
      }

      /**
       * Shows a confirmation dialog.
       * @param title The title of the confirmation.
       * @param text The main text content.
       * @param confirmButtonText Text for the confirm button (defaults to 'Yes, confirm').
       * @param cancelButtonText Text for the cancel button (defaults to 'No, cancel').
       * @param icon Icon for the dialog (defaults to 'question').
       * @returns A Promise that resolves with a SweetAlertResult indicating confirmation or dismissal.
       */
      showConfirmation(
        title: string,
        text: string,
        confirmButtonText: string = 'Yes, confirm',
        cancelButtonText: string = 'No, cancel',
        icon: SweetAlertIcon = 'question'
      ): Promise<SweetAlertResult> {
        return Swal.fire({
          title: title,
          text: text,
          icon: icon,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: confirmButtonText,
          cancelButtonText: cancelButtonText
        });
      }
}
