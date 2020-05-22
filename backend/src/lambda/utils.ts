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
    const host: string = event.headers['Host']
    let { path } = event.requestContext
    const shortUrlResourcePath = '/' + process.env.SHORT_URL_RESOURCE_NAME

    if (path.endsWith(shortUrlResourcePath)) {
        path = path.substring(0, path.length - shortUrlResourcePath.length)
    }

    if (host != null && path != null) {
        return "http://" + host + (path ? path : '')
    }
    return undefined
}