import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-add-short-url-dialog',
  templateUrl: './add-short-url-dialog.component.html',
  styleUrls: ['./add-short-url-dialog.component.scss']
})
export class AddShortUrlDialogComponent {
  longUrl: string = '';

  constructor(public dialogRef: MatDialogRef<AppComponent>) {}

  onAbortClick(): void {
    this.dialogRef.close();
  }

}
