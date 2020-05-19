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
    } catch (e) {
        logger.error('Could not find short url for given id', {"error": e})
        return {
            statusCode: 500,
            body: 'Could not retrieve url for given id'
        }
    }

    if (!redirectLocation) {
        logger.warn('Could not find short url for given id')
        return {
            statusCode: 404,
            body: 'Could not find url for given id'
        }
    }

    logger.info('Redirected requested', {"redirectLocation": redirectLocation})
    return {
      statusCode: 301,
      headers: {
          "Location": redirectLocation
      },
      body: ''
  }
}
