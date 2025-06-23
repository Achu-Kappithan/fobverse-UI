import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SweetAlert {

  constructor() { }

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

      showAlert(icon: SweetAlertIcon, title: string, text: string): Promise<SweetAlertResult> {
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
          cancelButtonText: cancelButtonText
        });
      }
}
