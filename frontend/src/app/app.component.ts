import {Component, OnInit, isDevMode} from '@angular/core';
import {AmplifyService}  from 'aws-amplify-angular';
import {CognitoUser, CognitoUserSession, CognitoAccessToken} from 'amazon-cognito-identity-js';
import {ShortUrlService} from "./services/short-url.service";
import {ShortUrl} from "../models/ShortUrl";
import {AddShortUrlDialogComponent} from "./add-short-url-dialog/add-short-url-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {EditShortUrlDialogComponent} from "./edit-short-url-dialog/edit-short-url-dialog.component";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['urlId', 'title', 'shortUrl', 'longUrl', 'action']
  dataSource: MatTableDataSource<ShortUrl> = new MatTableDataSource()

  public shortUrls: ShortUrl[]

  constructor(
    private amplify: AmplifyService,
    private shortUrl: ShortUrlService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.amplify.authStateChange$.subscribe(async authState => {
      console.log('authState:', authState.state)
      if (authState.state.localeCompare('signedIn') === 0) {

        if (isDevMode()) {
          const user: CognitoUser = authState.user
          const userSession: CognitoUserSession = user.getSignInUserSession()
          const idToken: CognitoAccessToken = userSession.getIdToken()
          console.log('jwtToken:', idToken.getJwtToken())
        }

        this.shortUrls = await this.shortUrl.getShortUrls()
        this.dataSource.data = this.shortUrls
        console.log('Short URLs:', this.shortUrls)
      }

    })
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddShortUrlDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.spinner.show()
        const newShortUrl: ShortUrl = await this.shortUrl.createNewShortUrl(result)
        if (newShortUrl != undefined) {
          this.dataSource.data.push(newShortUrl)
          this.dataSource._updateChangeSubscription()
          this.toastr.success('Successfully created Short URL!')
        } else {
          this.toastr.error('Could not create Short URL!')
        }
        await this.spinner.hide()
      }
    });
  }

  openEditDialog(shortUrl: ShortUrl): void {
    const dialogRef = this.dialog.open(EditShortUrlDialogComponent, {
      width: '500px',
      data: shortUrl
    });

    dialogRef.afterClosed().subscribe(async updatedShortUrl => {
      if (updatedShortUrl) {
        await this.spinner.show()
        const success = await this.shortUrl.updateShortUrl(updatedShortUrl)
        if (success) {
          const index = this.dataSource.data.findIndex(s => s.urlId.localeCompare(updatedShortUrl.urlId) == 0)
          this.dataSource.data[index] = updatedShortUrl
          this.dataSource._updateChangeSubscription()
          this.toastr.success('Successfully updated Short URL!')
        } else {
          this.toastr.error('Could not update Short URL!')
        }
        await this.spinner.hide()
      }
    });
  }

  public editShortUrl(shortUrl: ShortUrl) {
    this.openEditDialog(Object.assign({}, shortUrl))
  }

  async deleteShortUrl(shortUrl: ShortUrl) {
    await this.spinner.show()
    const shortUrlId = shortUrl.urlId
    const success = await this.shortUrl.deleteShortUrl(shortUrlId)
    if (success) {
      this.dataSource.data = this.dataSource.data.filter(s => s.urlId.localeCompare(shortUrl.urlId) != 0)
      this.toastr.success('Successfully deleted Short URL!')
    } else {
      this.toastr.error('Could not delete Short URL!')
    }
    await this.spinner.hide()

  }

}
