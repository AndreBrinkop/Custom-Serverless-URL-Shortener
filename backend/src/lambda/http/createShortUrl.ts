import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {createShortUrl} from "../../businessLogic/shortUrls";
import {CreateShortUrlRequest} from "../../models/requests/CreateShortUrlRequest";
import {getCallingHostUrl, getUserId} from "../utils";
const logger = createLogger('urlRedirect')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const contentType = event.headers['Content-Type'] ?? event.headers['content-type']
    if (!contentType || 'application/json'.localeCompare(contentType) !== 0) {
        return {
            statusCode: 415,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Request has an invalid content type'
        }
    }

    const userId = getUserId(event);
    const createShortUrlRequest: CreateShortUrlRequest = JSON.parse(event.body as string)
    logger.info('Requested a new short url', {"createShortUrlRequest": createShortUrlRequest, 'userId': userId})

    const callingUrl = getCallingHostUrl(event)
    if (!callingUrl) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Host header field is missing"'
        }
    }

    let shortUrl
    try {
        shortUrl = await createShortUrl(createShortUrlRequest, callingUrl, userId)
    } catch (e) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
                'Access-Control-Allow-Credentials': true
            },
            body: e.message
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(shortUrl)
    }
}
