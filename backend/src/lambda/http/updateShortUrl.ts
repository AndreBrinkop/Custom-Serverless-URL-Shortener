import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateShortUrlRequest } from '../../models/requests/UpdateShortUrlRequest'
import {createLogger} from "../../utils/logger";
import {updateShortUrl} from "../../businessLogic/shortUrls";

const logger = createLogger('updateShortUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.headers['Content-Type'] || 'application/json'.localeCompare(event.headers['Content-Type']) !== 0) {
        return {
            statusCode: 415,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Request has an invalid content type'
        }
    }

    const shortUrlId = event.pathParameters.shortUrlId
    if (!shortUrlId) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Url id path patameter is missing'
        }
    }

    const updateShortUrlRequest: UpdateShortUrlRequest = JSON.parse(event.body)
    logger.info('Update Short URL', {"shortUrlId": shortUrlId, "updatedShortUrl": updateShortUrlRequest})

    await updateShortUrl(shortUrlId, updateShortUrlRequest)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    }
}
