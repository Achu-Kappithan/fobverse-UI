
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternalUserComponent } from './add-internal-user.component';

describe('AddInternalUserComponent', () => {
  let component: AddInternalUserComponent;
  let fixture: ComponentFixture<AddInternalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [AddInternalUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInternalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
