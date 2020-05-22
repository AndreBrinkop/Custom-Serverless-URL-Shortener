import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {createShortUrl} from "../../businessLogic/shortUrls";
import {CreateShortUrlRequest} from "../../models/requests/CreateShortUrlRequest";
const logger = createLogger('urlRedirect')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const createShortUrlRequest: CreateShortUrlRequest = JSON.parse(event.body)
    logger.info('Requested a new short url', {"createShortUrlRequest": createShortUrlRequest})

    let host
    try {
        host = event.headers['Host']
    } catch (e) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Host header field is missing"'
        }
    }
    const { path } = event.requestContext
    const callingUrl = "http://" + host + path

    const shortUrl = await createShortUrl(createShortUrlRequest, callingUrl)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(shortUrl)
    }
}
