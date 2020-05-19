const axios = require('axios');
const cheerio = require('cheerio');
const base62 = require("base62/lib/ascii");

import {createLogger} from "../utils/logger";
import {ShortUrlAccess} from "../dataLayer/ShortUrlAccess";

const logger = createLogger('shortUrls')
const shortUrlAccess = new ShortUrlAccess()

export async function createShortUrl(url: string) {
    logger.info('Create Short Url', {"url": url})

    let bodyString: string
    try {
        const response = await axios.get(url)
        bodyString = response.data
    } catch (e) {
        throw new Error('Website for provided URL can not be accessed.')
    }
    let title = extractPageTitle(bodyString);

    const shortUrlSeed = await shortUrlAccess.createUniqueShortUrlSeed()
    const shortUrlId = generateShortUrlId(shortUrlSeed)

    return await shortUrlAccess.createShortUrl({
        urlId: shortUrlId,
        longUrl: url,
        title: title,
        createdAt: new Date().toISOString()
    })
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