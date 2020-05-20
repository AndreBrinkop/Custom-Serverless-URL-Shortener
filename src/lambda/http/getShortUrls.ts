
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {getAllShortUrls} from "../../businessLogic/shortUrls";

const logger = createLogger('getShortUrls')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Get all Short URLs', {'event': event})

    const items = await getAllShortUrls()
    return {
        statusCode: 200,
        body: JSON.stringify({
            items
        })
    }
}
