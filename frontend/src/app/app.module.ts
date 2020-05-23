import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatTableModule} from '@angular/material/table';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';

import {AmplifyService} from 'aws-amplify-angular';
import {AmplifyUIAngularModule} from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import {ShortUrlService} from "./services/short-url.service";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/* Configure Amplify resources */
const amplifyConfig = {
  Auth: {
    region: environment.awsCognitoRegion,
    userPoolId: environment.awsUserPoolsId,
    userPoolWebClientId: environment.awsUserPoolsWebClientId
  },
  API: {
    endpoints: [
      {
        name: "ShortUrlApi",
        endpoint: environment.shortUrlEndpoint
      }
    ]
  }
}

Amplify.configure(amplifyConfig);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmplifyUIAngularModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule
  ],
  providers: [
    AmplifyService,
    ShortUrlService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
