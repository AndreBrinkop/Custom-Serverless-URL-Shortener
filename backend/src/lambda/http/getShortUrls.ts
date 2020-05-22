import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {getAllShortUrls} from "../../businessLogic/shortUrls";
import {getCallingHostUrl, getUserId} from "../utils";

const logger = createLogger('getShortUrls')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    logger.info('Get all Short URLs', {'userId': userId})

    const callingUrl = getCallingHostUrl(event)
    if (!callingUrl) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Host header field is missing"'
        }
    }

    const items = await getAllShortUrls(userId, callingUrl)
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
