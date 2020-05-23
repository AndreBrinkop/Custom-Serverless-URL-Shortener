import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShortUrlDialogComponent } from './edit-short-url-dialog.component';

describe('EditShortUrlDialogComponent', () => {
  let component: EditShortUrlDialogComponent;
  let fixture: ComponentFixture<EditShortUrlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShortUrlDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShortUrlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
