import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
const logger = createLogger('urlRedirect')

const mockLocation = "http://google.de"

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const urlId = event.pathParameters.urlId
    logger.info('Redirect requested', {"urlId": urlId})

    return {
      statusCode: 301,
      headers: {
          "Location": mockLocation
      },
      body: ''
  };
};
