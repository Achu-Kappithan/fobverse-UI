import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new Subject<string>()
  message$ = this.messageSubject.asObservable()

  showSuccess(message:string){
    console.log("working")
    this.messageSubject.next(message)
  }

  showError(message:string){
    this.messageSubject.next(message)
  }

  showWarning(message:string){
    this.messageSubject.next(message)
  }

  clearMessage(){
    this.messageSubject.next("")
  }

}
