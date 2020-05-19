import {ShortUrlItem} from "../models/ShortUrlItem";

const AWS = require('aws-sdk');
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from "../utils/logger";

const logger = createLogger('ShortUrlAccess')

export class ShortUrlAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly shortUrlTable = process.env.SHORT_URL_TABLE as string,
        private readonly configTable = process.env.CONFIG_TABLE as string) {
    }

    async createUniqueShortUrlSeed(): Promise<string> {
        logger.info('Creating short URL seed');

        const response = await this.docClient.update({
            TableName: this.configTable,
            Key: {
                'configKey': "NextId"
            },
            // Retrieve and increment 'NextId' value or create if it does not exist
            UpdateExpression: 'SET configValue = if_not_exists(configValue, :zero) + :one',
            ExpressionAttributeValues: {
                ':one': 1,
                ':zero': 0
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();

        let seed
        try {
            seed = response.Attributes['configValue']
        } catch {
            throw new Error('Could not retrieve short URL seed')
        }
        logger.info('Created short URL seed',{"seed": seed});
        return seed.toString()
    }

    async createShortUrl(shortUrl: ShortUrlItem) {
        logger.info("Create Short URL", {"shortUrl": shortUrl});

        await this.docClient.put({
            TableName: this.shortUrlTable,
            Item: shortUrl
        }).promise();

        return shortUrl
    }

    async getShortUrl(shortUrlId: string) {
        logger.info("Get short URL", {"shortUrlId": shortUrlId})
        const result = await this.docClient
            .get({
                TableName: this.shortUrlTable,
                Key: {
                    'urlId' :shortUrlId
                }
            })
            .promise()

        return result.Item as ShortUrlItem
    }

}