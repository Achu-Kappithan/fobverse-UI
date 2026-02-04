import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUsComponent } from './about-us';
import { provideRouter } from '@angular/router';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('About Fobverse');
  });

  it('should have a link to job list', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[routerLink="/candidate/joblist"]');
    expect(link).toBeTruthy();
  });
});
