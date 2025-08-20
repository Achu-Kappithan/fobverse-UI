import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutJolist } from './layout-jolist';

describe('LayoutJolist', () => {
  let component: LayoutJolist;
  let fixture: ComponentFixture<LayoutJolist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
