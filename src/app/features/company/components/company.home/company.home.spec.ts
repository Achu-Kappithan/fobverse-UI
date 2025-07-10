import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHome } from './company.home';

describe('CompanyHome', () => {
  let component: CompanyHome;
  let fixture: ComponentFixture<CompanyHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
