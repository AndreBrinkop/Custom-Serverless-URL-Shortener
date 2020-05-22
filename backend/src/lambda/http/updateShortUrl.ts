import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateShortUrlRequest } from '../../models/requests/UpdateShortUrlRequest'
import {createLogger} from "../../utils/logger";
import {updateShortUrl} from "../../businessLogic/shortUrls";
import {getUserId} from "../utils";

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

    const userId = getUserId(event)
    const shortUrlId = event.pathParameters.shortUrlId
    logger.info('Update Short URL', {'userId': userId, 'shortUrlId': shortUrlId})

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
    await updateShortUrl(shortUrlId, updateShortUrlRequest, userId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    }
}
