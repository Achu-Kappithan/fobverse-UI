
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Authcomponent } from './authcomponent';

describe('Authcomponent', () => {
  let component: Authcomponent;
  let fixture: ComponentFixture<Authcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [Authcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Authcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
