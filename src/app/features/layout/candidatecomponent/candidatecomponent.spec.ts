import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Candidatecomponent } from './candidatecomponent';

describe('Candidatecomponent', () => {
  let component: Candidatecomponent;
  let fixture: ComponentFixture<Candidatecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candidatecomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Candidatecomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
