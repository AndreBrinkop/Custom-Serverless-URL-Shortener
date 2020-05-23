import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from "@angular/material/form-field";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';

import {AmplifyService} from 'aws-amplify-angular';
import {AmplifyUIAngularModule} from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import {ShortUrlService} from "./services/short-url.service";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AddShortUrlDialogComponent } from './add-short-url-dialog/add-short-url-dialog.component';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

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
    AppComponent,
    AddShortUrlDialogComponent
  ],
  imports: [
    BrowserModule,
    AmplifyUIAngularModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule
  ],
  providers: [
    AmplifyService,
    ShortUrlService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
