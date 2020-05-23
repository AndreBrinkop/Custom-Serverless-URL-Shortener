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
    const authInit = await this.createAuthHeader();
    return (await API.get('ShortUrlApi', this.shortUrlsResource, authInit))['items']
  }

  public async createNewShortUrl(longUrl: string): Promise<ShortUrl> {
    const authInit = await this.createAuthHeader();
    const requestInit = {
      headers: {
        ...authInit.headers,
        'Content-Type': 'application/json'
      },
      body: {
        url: longUrl
      }
    }
    return (await API.post('ShortUrlApi', this.shortUrlsResource, requestInit))
  }

  public async deleteShortUrl(shortUrlId: string): Promise<Boolean> {
    const authInit = await this.createAuthHeader();
    try {
      await API.del('ShortUrlApi', this.shortUrlsResource + '/' + shortUrlId, authInit)
    } catch {
      return false
    }
    return true
  }

  private async createAuthHeader() {
    return {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };
  }
}
