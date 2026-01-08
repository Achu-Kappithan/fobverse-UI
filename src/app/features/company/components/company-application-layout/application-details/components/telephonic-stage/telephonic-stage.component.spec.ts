import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelephonicStageComponent } from './telephonic-stage.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('TelephonicStageComponent', () => {
  let component: TelephonicStageComponent;
  let fixture: ComponentFixture<TelephonicStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelephonicStageComponent, ReactiveFormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TelephonicStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
