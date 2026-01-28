
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyApplicationLayout } from './company-application-layout';

describe('CompanyApplicationLayout', () => {
  let component: CompanyApplicationLayout;
  let fixture: ComponentFixture<CompanyApplicationLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [CompanyApplicationLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyApplicationLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
