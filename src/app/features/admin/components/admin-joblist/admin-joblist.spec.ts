import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJoblist } from './admin-joblist';

describe('AdminJoblist', () => {
  let component: AdminJoblist;
  let fixture: ComponentFixture<AdminJoblist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminJoblist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJoblist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
