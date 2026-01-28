
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileinfo } from './update-profileinfo';

describe('UpdateProfileinfo', () => {
  let component: UpdateProfileinfo;
  let fixture: ComponentFixture<UpdateProfileinfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [UpdateProfileinfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileinfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
