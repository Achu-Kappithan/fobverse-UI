import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllApplicantsComponent } from './all-applicants';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('AllApplicantsComponent', () => {
  let component: AllApplicantsComponent;
  let fixture: ComponentFixture<AllApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllApplicantsComponent, RouterTestingModule, FormsModule]
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
    expect(component.filteredApplicants.length).toBe(1);
    expect(component.filteredApplicants[0].name).toBe('Jake Gyll');
  });

  it('should update pagination when search query changes', () => {
    component.pageSize = 5;
    component.searchQuery = '';
    component.onSearchChange();
    expect(component.filteredApplicants.length).toBe(5);
    expect(component.currentPage).toBe(1);
  });

  it('should change page correctly', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.filteredApplicants.length).toBeGreaterThan(0);
  });
});
