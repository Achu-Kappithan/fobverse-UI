import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QualifiedStageComponent } from './qualified-stage.component';

describe('QualifiedStageComponent', () => {
  let component: QualifiedStageComponent;
  let fixture: ComponentFixture<QualifiedStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
