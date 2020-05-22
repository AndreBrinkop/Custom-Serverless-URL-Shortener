import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {getAllShortUrls} from "../../businessLogic/shortUrls";
import {getUserId} from "../utils";

const logger = createLogger('getShortUrls')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    logger.info('Get all Short URLs', {'userId': userId})

    const items = await getAllShortUrls(userId)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            items
        })
    }
}
