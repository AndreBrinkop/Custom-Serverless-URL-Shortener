import {Component, OnInit, isDevMode} from '@angular/core';
import {AmplifyService}  from 'aws-amplify-angular';
import {CognitoUser, CognitoUserSession, CognitoAccessToken} from 'amazon-cognito-identity-js';
import {ShortUrlService} from "./services/short-url.service";
import {ShortUrl} from "../models/ShortUrl";
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['urlId', 'title', 'shortUrl', 'longUrl'];
  dataSource = [];

  public shortUrls: ShortUrl[]

  constructor(
    private amplify: AmplifyService,
    private shortUrl: ShortUrlService
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
        this.dataSource = this.shortUrls
        console.log('Short URLs:', this.shortUrls)
      }

    })
  }


}
