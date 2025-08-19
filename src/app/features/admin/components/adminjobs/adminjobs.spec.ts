import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminjobs } from './adminjobs';

describe('Adminjobs', () => {
  let component: Adminjobs;
  let fixture: ComponentFixture<Adminjobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminjobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminjobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
