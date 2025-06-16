import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateHome } from './candidate-home';

describe('CandidateHome', () => {
  let component: CandidateHome;
  let fixture: ComponentFixture<CandidateHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
