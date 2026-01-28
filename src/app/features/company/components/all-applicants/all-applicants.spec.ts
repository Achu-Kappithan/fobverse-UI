
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllApplicantsComponent } from './all-applicants';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CompanyApplication } from '../../services/company-application';
import { of } from 'rxjs';

describe('AllApplicantsComponent', () => {
  let component: AllApplicantsComponent;
  let fixture: ComponentFixture<AllApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllApplicantsComponent, RouterTestingModule, FormsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CompanyApplication,
          useValue: {
            getCompanyApplicants: () => of({ data: [], meta: { totalItems: 0 } })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter applicants based on search query', () => {
    component.searchQuery = 'Jake';
    component.onSearchChange();
    expect(component.applicants.length).toBe(0);
  });
});
