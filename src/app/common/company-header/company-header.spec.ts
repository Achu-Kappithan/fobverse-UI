import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHeader } from './company-header';

describe('CompanyHeader', () => {
  let component: CompanyHeader;
  let fixture: ComponentFixture<CompanyHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
