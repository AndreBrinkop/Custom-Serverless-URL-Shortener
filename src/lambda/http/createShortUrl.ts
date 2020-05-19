import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {createShortUrl} from "../../businessLogic/shortUrls";
const logger = createLogger('urlRedirect')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { url } = JSON.parse(event.body)
    logger.info('Requested a new short url', {"url": url})

    let host
    try {
        host = event.headers['Host']
    } catch (e) {
        return {
            statusCode: 400,
            body: 'Host header field is missing"'
        }
    }
    const { path } = event.requestContext
    const callingUrl = "http://" + host + path

    const shortUrl = await createShortUrl(url, callingUrl)

    return {
        statusCode: 200,
        body: JSON.stringify(shortUrl)
    }
}
