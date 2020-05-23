import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShortUrlDialogComponent } from './add-short-url-dialog.component';

describe('AddShortUrlDialogComponent', () => {
  let component: AddShortUrlDialogComponent;
  let fixture: ComponentFixture<AddShortUrlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShortUrlDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShortUrlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
