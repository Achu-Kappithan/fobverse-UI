import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListcompanys } from './admin-listcompanys';

describe('AdminListcompanys', () => {
  let component: AdminListcompanys;
  let fixture: ComponentFixture<AdminListcompanys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListcompanys]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminListcompanys);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
