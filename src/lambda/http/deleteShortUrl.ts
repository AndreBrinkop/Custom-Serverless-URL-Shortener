import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
//import {deleteShortUrl} from "../../businessLogic/shortUrls";

const logger = createLogger('deleteShortUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const shortUrlId = event.pathParameters.id
    logger.info('Delete Short URL', {"shortUrlId": shortUrlId})

    //await deleteShortUrl(shortUrlId)

    return {
        statusCode: 200,
        body: ''
    }
}
