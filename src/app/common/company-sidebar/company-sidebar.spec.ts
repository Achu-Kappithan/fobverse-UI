import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySidebar } from './company-sidebar';

describe('CompanySidebar', () => {
  let component: CompanySidebar;
  let fixture: ComponentFixture<CompanySidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
