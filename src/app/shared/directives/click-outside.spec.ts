import { ClickOutsideDirective } from './click-outside';
import { ElementRef } from '@angular/core';

describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {


    const directive = new ClickOutsideDirective({ nativeElement: document.createElement('div') } as ElementRef);
    expect(directive).toBeTruthy();
  });
});
