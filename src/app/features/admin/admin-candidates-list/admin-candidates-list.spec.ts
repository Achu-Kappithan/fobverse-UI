import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCandidatesList } from './admin-candidates-list';

describe('AdminCandidatesList', () => {
  let component: AdminCandidatesList;
  let fixture: ComponentFixture<AdminCandidatesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCandidatesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCandidatesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
