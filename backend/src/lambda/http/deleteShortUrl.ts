import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {deleteShortUrl} from "../../businessLogic/shortUrls";
import {getUserId} from "../utils";

const logger = createLogger('deleteShortUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
    logger.info('Delete Short URL', {'userId': userId, 'shortUrlId': shortUrlId})

    try {
        await deleteShortUrl(shortUrlId, userId)
    } catch {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Can not find url to delete'
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
