import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {resolveShortUrl} from "../../businessLogic/shortUrls";
const logger = createLogger('urlRedirect')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let redirectLocation
    try {
        const urlId = event.pathParameters.urlId
        logger.info('Redirect requested', {"urlId": urlId})
        redirectLocation = await resolveShortUrl(urlId)
    } catch {
        return {
            statusCode: 404,
            body: 'Could not find short url for given id'
        }
    }

    return {
      statusCode: 301,
      headers: {
          "Location": redirectLocation
      },
      body: ''
  }
}
