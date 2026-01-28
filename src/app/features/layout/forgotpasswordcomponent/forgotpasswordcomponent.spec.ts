
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forgotpasswordcomponent } from './forgotpasswordcomponent';

describe('Forgotpasswordcomponent', () => {
  let component: Forgotpasswordcomponent;
  let fixture: ComponentFixture<Forgotpasswordcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
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
