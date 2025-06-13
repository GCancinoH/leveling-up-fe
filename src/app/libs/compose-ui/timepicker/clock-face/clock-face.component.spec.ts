import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockFaceComponent } from './clock-face.component';

describe('ClockFaceComponent', () => {
  let component: ClockFaceComponent;
  let fixture: ComponentFixture<ClockFaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockFaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClockFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
