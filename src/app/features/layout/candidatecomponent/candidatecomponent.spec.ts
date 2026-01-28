
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Candidatecomponent } from './candidatecomponent';

describe('Candidatecomponent', () => {
  let component: Candidatecomponent;
  let fixture: ComponentFixture<Candidatecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
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
