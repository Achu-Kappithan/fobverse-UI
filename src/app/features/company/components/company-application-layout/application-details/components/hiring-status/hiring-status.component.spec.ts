
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HiringStatusComponent } from './hiring-status.component';

describe('HiringStatusComponent', () => {
  let component: HiringStatusComponent;
  let fixture: ComponentFixture<HiringStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [HiringStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
