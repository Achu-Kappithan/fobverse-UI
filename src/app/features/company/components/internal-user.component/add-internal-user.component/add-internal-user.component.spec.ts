import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternalUserComponent } from './add-internal-user.component';

describe('AddInternalUserComponent', () => {
  let component: AddInternalUserComponent;
  let fixture: ComponentFixture<AddInternalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
