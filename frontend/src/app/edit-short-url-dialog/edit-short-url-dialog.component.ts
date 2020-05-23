import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AppComponent} from "../app.component";
import {ShortUrl} from "../../models/ShortUrl";

@Component({
  selector: 'app-edit-short-url-dialog',
  templateUrl: './edit-short-url-dialog.component.html',
  styleUrls: ['./edit-short-url-dialog.component.scss']
})
export class EditShortUrlDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public shortUrl: ShortUrl)
  {}

  onAbortClick(): void {
    this.dialogRef.close();
  }
}
