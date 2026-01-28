
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfile } from './update-profile';

describe('UpdateProfile', () => {
  let component: UpdateProfile;
  let fixture: ComponentFixture<UpdateProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [UpdateProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
