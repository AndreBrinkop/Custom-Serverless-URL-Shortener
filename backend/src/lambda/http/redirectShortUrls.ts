import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {resolveShortUrl} from "../../businessLogic/shortUrls";
const logger = createLogger('urlRedirect')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

    let redirectLocation
    try {
        logger.info('Redirect requested', {"shortUrlId": shortUrlId})
        redirectLocation = await resolveShortUrl(shortUrlId)
    } catch (e) {
        logger.error('Could not find short url for given id', {"error": e})
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Could not retrieve url for given id'
        }
    }

    if (!redirectLocation) {
        logger.warn('Could not find short url for given id')
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
                'Access-Control-Allow-Credentials': true
            },
            body: 'Could not find url for given id'
        }
    }

    logger.info('Redirected requested', {"redirectLocation": redirectLocation})
    return {
      statusCode: 301,
      headers: {
          "Location": redirectLocation,
          'Access-Control-Allow-Origin': process.env.FRONTEND_URL as string,
          'Access-Control-Allow-Credentials': true
      },
      body: ''
  }
}
