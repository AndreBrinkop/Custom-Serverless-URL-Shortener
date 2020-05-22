import {APIGatewayProxyEvent} from "aws-lambda";
import {decode} from 'jsonwebtoken'
import {JwtPayload} from "../models/JwtPayload";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    return parseUserId(jwtToken)
}

function parseUserId(jwtToken: string): string {
    const decodedJwt = decode(jwtToken) as JwtPayload
    return decodedJwt.sub
}

export function getCallingHostUrl(event: APIGatewayProxyEvent): string {
    let { domainName } = event.requestContext
    let { path } = event.requestContext
    const shortUrlResourcePath = '/' + process.env.SHORT_URL_RESOURCE_NAME

    path = path ? path : ''
    if (path.endsWith('/')) {
        path = path.substring(0, Math.max(0, path.length - 1))
    }
    if (path.endsWith(shortUrlResourcePath)) {
        path = path.substring(0, Math.max(0, path.length - shortUrlResourcePath.length))
    }

    if (domainName.includes('offlineContext')) {
        return 'http://localhost:3000' + path
    }

    return "https://" + domainName + (path ? path : '')
}