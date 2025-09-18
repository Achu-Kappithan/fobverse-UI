import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyJobapplications } from './company-jobapplications';

describe('CompanyJobapplications', () => {
  let component: CompanyJobapplications;
  let fixture: ComponentFixture<CompanyJobapplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyJobapplications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyJobapplications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
