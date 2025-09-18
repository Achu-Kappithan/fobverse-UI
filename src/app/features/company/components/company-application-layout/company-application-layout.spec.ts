import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyApplicationLayout } from './company-application-layout';

describe('CompanyApplicationLayout', () => {
  let component: CompanyApplicationLayout;
  let fixture: ComponentFixture<CompanyApplicationLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
