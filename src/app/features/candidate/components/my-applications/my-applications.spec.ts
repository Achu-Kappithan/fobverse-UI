import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyApplicationsComponent } from './my-applications';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('MyApplicationsComponent', () => {
  let component: MyApplicationsComponent;
  let fixture: ComponentFixture<MyApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyApplicationsComponent, CommonModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of applications', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.bg-white.rounded-xl.shadow-sm');
    expect(cards.length).toBe(component.applications.length);
  });
});
