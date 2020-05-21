import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { AmplifyService }  from 'aws-amplify-angular';
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';

/* Configure Amplify resources */
const cognitoConfig = {
  "aws_cognito_region": environment.awsCognitoRegion,
  "aws_user_pools_id": environment.awsUserPoolsId,
  "aws_user_pools_web_client_id": environment.awsUserPoolsWebClientId
}
Amplify.configure(cognitoConfig);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmplifyUIAngularModule,
    AppRoutingModule
  ],
  providers: [
    AmplifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
