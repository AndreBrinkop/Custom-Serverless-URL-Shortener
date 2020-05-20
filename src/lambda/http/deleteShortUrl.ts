import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {deleteShortUrl} from "../../businessLogic/shortUrls";
//import {deleteShortUrl} from "../../businessLogic/shortUrls";

const logger = createLogger('deleteShortUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const shortUrlId = event.pathParameters.shortUrlId
    if (!shortUrlId) {
        return {
            statusCode: 400,
            body: 'Url id path patameter is missing'
        }
    }

    logger.info('Delete Short URL', {"shortUrlId": shortUrlId})

    await deleteShortUrl(shortUrlId)

    return {
        statusCode: 200,
        body: ''
    }
}
