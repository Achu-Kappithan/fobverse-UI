import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateHeader } from './candidate-header';

describe('CandidateHeader', () => {
  let component: CandidateHeader;
  let fixture: ComponentFixture<CandidateHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
