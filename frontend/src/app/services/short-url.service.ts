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
    try {
      return (await API.post('ShortUrlApi', this.shortUrlsResource, requestInit))
    } catch (e) {
      console.log(e)
      return undefined
    }
  }

  public async updateShortUrl(updatedShortUrl: ShortUrl): Promise<Boolean> {
    const authInit = await this.createAuthHeader();
    const requestInit = {
      headers: {
        ...authInit.headers,
        'Content-Type': 'application/json'
      },
      body: {
        title: updatedShortUrl.title
      }
    }
    try {
      await API.patch('ShortUrlApi', this.shortUrlsResource + '/' + updatedShortUrl.urlId, requestInit)
    } catch (e) {
      console.log(e)
      return false
    }
    return true
  }

  public async deleteShortUrl(shortUrlId: string): Promise<Boolean> {
    const authInit = await this.createAuthHeader();
    try {
      await API.del('ShortUrlApi', this.shortUrlsResource + '/' + shortUrlId, authInit)
    } catch (e) {
      console.log(e)
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
