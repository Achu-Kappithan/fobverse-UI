import { ClickOutsideDirective } from './click-outside';

describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {
    // Note: In Angular, directives usually need an ElementRef to be instantiated.
    // However, for a simple 'should create' test, we can mock it if needed.
    const directive = new ClickOutsideDirective({ nativeElement: document.createElement('div') } as any);
    expect(directive).toBeTruthy();
  });
});
