import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {UpdateShortUrlRequest} from '../../models/requests/UpdateShortUrlRequest'
import {createLogger} from "../../utils/logger";
import {updateShortUrl} from "../../businessLogic/shortUrls";
import {getUserId} from "../utils";

const logger = createLogger('updateShortUrl')

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

    const userId = getUserId(event)

    if (!event.pathParameters || !event.pathParameters.shortUrlId) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Url id path patameter is missing'
        }
    }

    const shortUrlId = event.pathParameters.shortUrlId
    logger.info('Update Short URL', {'userId': userId, 'shortUrlId': shortUrlId})

    if (!shortUrlId) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Url id path patameter is missing'
        }
    }

    const updateShortUrlRequest: UpdateShortUrlRequest = JSON.parse(event.body as string)
    try {
        await updateShortUrl(shortUrlId, updateShortUrlRequest, userId)
    } catch {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Can not find url to update'
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    }
}
