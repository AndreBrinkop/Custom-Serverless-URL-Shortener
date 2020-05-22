import {createLogger} from "../utils/logger";
import {ShortUrlAccess} from "../dataLayer/ShortUrlAccess";
import {UpdateShortUrlRequest} from "../models/requests/UpdateShortUrlRequest";
import {ShortUrlItem} from "../models/ShortUrlItem";
import {ShortUrlResponse} from "../models/ShortUrlResponse";
import {ShortUrlUpdate} from "../models/ShortUrlUpdate";
import {CreateShortUrlRequest} from "../models/requests/CreateShortUrlRequest";

const superagent = require('superagent');
const cheerio = require('cheerio');
const base62 = require("base62/lib/ascii");

const logger = createLogger('shortUrls')
const shortUrlAccess = new ShortUrlAccess()

export async function getAllShortUrls(userId: string, callingUrl: string): Promise<ShortUrlResponse[]> {
    logger.info('Get all Todo Items',{'userId': userId} )
    const shortUrlItems = await shortUrlAccess.getAllShortUrls(userId)
    return shortUrlItems.map(shortUrlItem => createShortUrlResponse(shortUrlItem, callingUrl))
}

export async function createShortUrl(createShortUrlRequest: CreateShortUrlRequest, callingUrl: string, userId: string) {
    logger.info('Create Short Url', {'createShortUrlRequest': createShortUrlRequest, 'callingUrl': callingUrl, 'userId': userId})

    const url = createShortUrlRequest.url
    let bodyString: string
    try {
        const response = await superagent.get(url).timeout({
            response: 2500,
            deadline: 3000
        })
        logger.info('Fetched URL content')
        bodyString = response.text
    } catch (e) {
        logger.info('Website for provided URL can not be accessed', {'error': e})
    }
    let title = extractPageTitle(bodyString);

    const shortUrlSeed = await shortUrlAccess.createUniqueShortUrlSeed()
    const shortUrlId = generateShortUrlId(shortUrlSeed)

    const shortUrlItem = await shortUrlAccess.createShortUrl({
        urlId: shortUrlId,
        userId: userId,
        longUrl: url,
        title: title,
        createdAt: new Date().toISOString()
    })

    return createShortUrlResponse(shortUrlItem, callingUrl)
}

export async function resolveShortUrl(shortUrlId: string): Promise<string> {
    let shortUrl: ShortUrlItem = await shortUrlAccess.getShortUrl(shortUrlId)
    return shortUrl ? shortUrl.longUrl : null
}

export async function updateShortUrl(shortUrlId: string, updateShortUrlRequest: UpdateShortUrlRequest, userId: string): Promise<void> {
    logger.info('Update Short URL', {"updateShortUrlRequest": updateShortUrlRequest, 'userId': userId})
    const shortUrlUpdate: ShortUrlUpdate = {
        shortUrlId,
        ...updateShortUrlRequest
    }
    await shortUrlAccess.updateShortUrl(shortUrlUpdate, userId)
}

export async function deleteShortUrl(shortUrlId: string, userId: string): Promise<void> {
    logger.info('Delete Short URL', {"shortUrlId": shortUrlId, 'userId': userId})
    await shortUrlAccess.deleteShortUrl(shortUrlId, userId)
}

function extractPageTitle(bodyString: string): string {
    let title: string;
    try {
        const body = cheerio.load(bodyString);
        title = body('title').text();
    } catch (e) {
        title = 'No Title'
    }
    return title;
}

function generateShortUrlId(seed: string): string {
    return base62.encode(seed)
}

function createShortUrlResponse(shortUrlItem: ShortUrlItem, callingUrl: string): ShortUrlResponse {
    return {
        shortUrl: callingUrl + '/' + shortUrlItem.urlId,
        urlId: shortUrlItem.urlId,
        longUrl: shortUrlItem.longUrl,
        title: shortUrlItem.title,
        createdAt: shortUrlItem.createdAt
    }
}