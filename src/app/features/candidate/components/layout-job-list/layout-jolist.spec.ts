
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutJolist } from './layout-jolist';

describe('LayoutJolist', () => {
  let component: LayoutJolist;
  let fixture: ComponentFixture<LayoutJolist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [LayoutJolist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutJolist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
