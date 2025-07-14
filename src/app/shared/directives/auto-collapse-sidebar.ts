import { Directive, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appAutoCollapseSidebar]'
})
export class AutoCollapseSidebar implements OnInit {
  @Input()isOpen: boolean = true
  @Output() isOpenChange = new EventEmitter<boolean>()

  ngOnInit(): void {
    this.checkScreenSize()
  }

  @HostListener('window:resize',[])
  onResize(){
    this.checkScreenSize();
  }

  private checkScreenSize():void{
    if (window.innerWidth < 768 && this.isOpen){
      this.isOpen = false
      this.isOpenChange.emit(this.isOpen)
    }
  }
}
