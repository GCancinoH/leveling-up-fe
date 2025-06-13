import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlDialogComponent } from './sl-dialog.component';

describe('SlDialogComponent', () => {
  let component: SlDialogComponent;
  let fixture: ComponentFixture<SlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
