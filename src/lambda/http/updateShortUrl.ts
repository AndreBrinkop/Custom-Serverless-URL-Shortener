import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateShortUrlRequest } from '../../models/requests/UpdateShortUrlRequest'
import {createLogger} from "../../utils/logger";
import {updateShortUrl} from "../../businessLogic/shortUrls";

const logger = createLogger('updateShortUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const shortUrlId = event.pathParameters.shortUrlId
    if (!shortUrlId) {
        return {
            statusCode: 400,
            body: 'Url id path patameter is missing'
        }
    }

    const updatedShortUrl: UpdateShortUrlRequest = JSON.parse(event.body)
    logger.info('Update Short URL', {"shortUrlId": shortUrlId, "updatedShortUrl": updatedShortUrl})

    await updateShortUrl(shortUrlId, updatedShortUrl)

    return {
        statusCode: 200,
        body: ''
    }
}
