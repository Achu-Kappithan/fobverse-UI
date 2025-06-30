import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forgotpasswordcomponent } from './forgotpasswordcomponent';

describe('Forgotpasswordcomponent', () => {
  let component: Forgotpasswordcomponent;
  let fixture: ComponentFixture<Forgotpasswordcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forgotpasswordcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forgotpasswordcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
