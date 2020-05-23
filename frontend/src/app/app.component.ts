import {Component, OnInit, isDevMode} from '@angular/core';
import {AmplifyService}  from 'aws-amplify-angular';
import {CognitoUser, CognitoUserSession, CognitoAccessToken} from 'amazon-cognito-identity-js';
import {ShortUrlService} from "./services/short-url.service";
import {ShortUrl} from "../models/ShortUrl";
import {AddShortUrlDialogComponent} from "./add-short-url-dialog/add-short-url-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";

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
      const newShortUrl: ShortUrl = await this.shortUrl.createNewShortUrl(result)
      this.dataSource.data.push(newShortUrl)
      this.dataSource._updateChangeSubscription()
    });
  }

  editShortUrl(shortUrl: ShortUrl) {
    console.log('edit', shortUrl)
  }

  async deleteShortUrl(shortUrl: ShortUrl) {
    const shortUrlId = shortUrl.urlId
    const success = await this.shortUrl.deleteShortUrl(shortUrlId)
    if (success) {
      this.dataSource.data = this.dataSource.data.filter(s => s.urlId.localeCompare(shortUrl.urlId) != 0)
    }
  }

}
