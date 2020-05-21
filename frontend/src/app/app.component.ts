import {Component, OnInit} from '@angular/core';
import { AmplifyService }  from 'aws-amplify-angular';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public amplify: AmplifyService) {
  }

  ngOnInit(): void {
    this.amplify.authStateChange$.subscribe(authState => {
      console.log(authState.user)
    })
  }


}
