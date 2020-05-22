import {Component, OnInit, isDevMode} from '@angular/core';
import {AmplifyService}  from 'aws-amplify-angular';
import {CognitoUser, CognitoUserSession, CognitoAccessToken} from 'amazon-cognito-identity-js';
import {ShortUrlService} from "./services/short-url.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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
          const accessToken: CognitoAccessToken = userSession.getAccessToken()
          console.log('jwtToken:', accessToken.getJwtToken())
        }

        const shortUrls = await this.shortUrl.getShortUrls()
        console.log('Short URLs:', shortUrls)
      }

    })
  }


}
