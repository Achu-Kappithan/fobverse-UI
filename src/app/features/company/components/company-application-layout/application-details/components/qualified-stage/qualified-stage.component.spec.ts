
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QualifiedStageComponent } from './qualified-stage.component';

describe('QualifiedStageComponent', () => {
  let component: QualifiedStageComponent;
  let fixture: ComponentFixture<QualifiedStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [QualifiedStageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QualifiedStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
