import { Injectable } from '@angular/core';
import { API, Auth } from 'aws-amplify';
import {ShortUrl} from "../../models/ShortUrl";


@Injectable({
  providedIn: 'root'
})
export class ShortUrlService {
  private shortUrlsResource = '/shortUrls'

  constructor() { }

  public async getShortUrls(): Promise<ShortUrl[]> {
    const authInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };
    return (await API.get('ShortUrlApi', this.shortUrlsResource, authInit))['items']
  }
}
