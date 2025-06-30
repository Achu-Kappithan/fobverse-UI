import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassEmail } from './forgot.pass.email';

describe('ForgotPassEmail', () => {
  let component: ForgotPassEmail;
  let fixture: ComponentFixture<ForgotPassEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPassEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPassEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
