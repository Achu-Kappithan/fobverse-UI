import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlert {
  constructor() {}

  // showSuccessToast(
  //   title: string,
  //   text: string = '',
  //   timer: number = 7000
  // ): void {
  //   Swal.fire({
  //     icon: 'error',
  //     title: title,
  //     text: text,
  //     toast: true,
  //     position: 'top-end',
  //     showConfirmButton: false,
  //     timer: timer,
  //     timerProgressBar: true,
  //     didOpen: (toast) => {
  //       toast.addEventListener('mouseenter', Swal.stopTimer);
  //       toast.addEventListener('mouseleave', Swal.resumeTimer);
  //     },
  //   });
  // }

  // showErrorToast(title: string, text: string = '', timer: number = 5000): void {
  //   Swal.fire({
  //     icon: 'error',
  //     title: title,
  //     text: text,
  //     toast: true,
  //     position: 'top-end',
  //     showConfirmButton: false,
  //     timer: timer,
  //     timerProgressBar: true,
  //     didOpen: (toast) => {
  //       toast.addEventListener('mouseenter', Swal.stopTimer);
  //       toast.addEventListener('mouseleave', Swal.resumeTimer);
  //     },
  //   });
  // }

  // showInfoToast(title: string, text: string = '', timer: number = 3000): void {
  //   Swal.fire({
  //     icon: 'info',
  //     title: title,
  //     text: text,
  //     toast: true,
  //     position: 'top-end',
  //     showConfirmButton: false,
  //     timer: timer,
  //     timerProgressBar: true,
  //     didOpen: (toast) => {
  //       toast.addEventListener('mouseenter', Swal.stopTimer);
  //       toast.addEventListener('mouseleave', Swal.resumeTimer);
  //     },
  //   });
  // }

  // showAlert(
  //   icon: SweetAlertIcon,
  //   title: string,
  //   text: string
  // ): Promise<SweetAlertResult> {
  //   return Swal.fire({
  //     icon: icon,
  //     title: title,
  //     text: text,
  //     confirmButtonText: 'OK',
  //     allowOutsideClick: false,
  //     allowEscapeKey: false,
  //   });
  // }

  // showConfirmation(
  //   title: string,
  //   text: string,
  //   confirmButtonText: string = 'Yes, confirm',
  //   cancelButtonText: string = 'No, cancel',
  //   icon: SweetAlertIcon = 'question'
  // ): Promise<SweetAlertResult> {
  //   return Swal.fire({
  //     title: title,
  //     text: text,
  //     icon: icon,
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: confirmButtonText,
  //     cancelButtonText: cancelButtonText,
  //   });
  // }

   // Base options for our toasts to ensure consistency
  private baseToastOptions: SweetAlertOptions = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    // Custom classes for styling
    customClass: {
      popup: 'swal2-toast-popup',
      title: 'swal2-toast-title',
      htmlContainer: 'swal2-toast-content',
      icon: 'swal2-toast-icon',
      timerProgressBar: 'swal2-toast-progress',
    },
    width: 'auto', // Adjust width automatically based on content
  };

  showSuccessToast(
    title: string,
    text: string = '',
    timer: number = 7000
  ): void {
    Swal.fire({
      ...this.baseToastOptions, // Spread base options
      icon: 'success',
      title: title,
      text: text,
      timer: timer,
      // Specific class for success toast background/border
      customClass: {
        ...this.baseToastOptions.customClass,
        popup: `${this.baseToastOptions.customClass?.popup} swal2-toast-success`,
      },
    });
  }

  showErrorToast(title: string, text: string = '', timer: number = 5000): void {
    Swal.fire({
      ...this.baseToastOptions,
      icon: 'error',
      title: title,
      text: text,
      timer: timer,
      customClass: {
        ...this.baseToastOptions.customClass,
        popup: `${this.baseToastOptions.customClass?.popup} swal2-toast-error`,
      },
    });
  }

  showInfoToast(title: string, text: string = '', timer: number = 3000): void {
    Swal.fire({
      ...this.baseToastOptions,
      icon: 'info',
      title: title,
      text: text,
      timer: timer,
      customClass: {
        ...this.baseToastOptions.customClass,
        popup: `${this.baseToastOptions.customClass?.popup} swal2-toast-info`,
      },
    });
  }

  showLoadingToast(title: string, text: string = ''): void {
    Swal.fire({
      ...this.baseToastOptions,
      title: title,
      text: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      timer: undefined, // No auto-close for loading
      timerProgressBar: false, // No progress bar for loading
      didOpen: (toast) => {
        Swal.showLoading();
        // Remove event listeners for loading toast as it's not timer-based
        toast.removeEventListener('mouseenter', Swal.stopTimer);
        toast.removeEventListener('mouseleave', Swal.resumeTimer);
      },
      customClass: {
        ...this.baseToastOptions.customClass,
        popup: `${this.baseToastOptions.customClass?.popup} swal2-toast-loading`,
      },
    });
  }

  closeToast(): void {
    Swal.close();
  }

  // --- Existing Alert Methods (not changed for toast styling) ---
  showAlert(
    icon: SweetAlertIcon,
    title: string,
    text: string
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }

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
      cancelButtonText: cancelButtonText,
    });
  }

}
