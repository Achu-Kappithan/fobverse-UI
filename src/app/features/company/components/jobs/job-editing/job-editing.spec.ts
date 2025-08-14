import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobEditing } from './job-editing';

describe('JobEditing', () => {
  let component: JobEditing;
  let fixture: ComponentFixture<JobEditing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobEditing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobEditing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
