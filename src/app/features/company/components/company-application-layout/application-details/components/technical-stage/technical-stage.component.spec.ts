
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicalStageComponent } from './technical-stage.component';

describe('TechnicalStageComponent', () => {
  let component: TechnicalStageComponent;
  let fixture: ComponentFixture<TechnicalStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [TechnicalStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
