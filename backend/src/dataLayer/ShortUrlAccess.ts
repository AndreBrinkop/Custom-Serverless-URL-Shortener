import {ShortUrlItem} from "../models/ShortUrlItem";

const AWSXRay = require('aws-xray-sdk');
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from "../utils/logger";
import {ShortUrlUpdate} from "../models/ShortUrlUpdate";

const logger = createLogger('ShortUrlAccess')
// Capture all created AWS clients
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

export class ShortUrlAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly shortUrlTable = process.env.SHORT_URL_TABLE as string,
        private readonly shortUrlIdIndex = process.env.SHORT_URL_ID_INDEX as string,
        private readonly configTable = process.env.CONFIG_TABLE as string) {
    }

    async getAllShortUrls(userId: string): Promise<ShortUrlItem[]> {
        logger.info('Get all short URLs', {'userId': userId})
        const result = await this.docClient
            .query({
                TableName: this.shortUrlTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise()
        return result.Items as ShortUrlItem[]
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

        if (!response.Attributes || !response.Attributes['configValue']) {
            throw new Error('Could not retrieve short URL seed')
        }
        let seed = response.Attributes['configValue']
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
            .query({
                TableName: this.shortUrlTable,
                IndexName: this.shortUrlIdIndex,
                KeyConditionExpression: 'urlId = :shortUrlId',
                ExpressionAttributeValues: {
                    ':shortUrlId': shortUrlId
                }
            })
            .promise()

        if(!result.Items || result.Items.length < 1) {
            throw new Error('Could not find short url')
        }

        return result.Items[0] as ShortUrlItem
    }

    async updateShortUrl(shortUrlUpdate: ShortUrlUpdate, userId: string): Promise<void> {
        logger.info('Update Short URL', {'shortUrlUpdate': shortUrlUpdate, 'userId': userId});

        await this.docClient.update({
            TableName: this.shortUrlTable,
            Key: {
                'userId': userId,
                'urlId': shortUrlUpdate.shortUrlId
            },
            UpdateExpression: 'set title = :title',
            ConditionExpression: 'attribute_exists(urlId)',
            ExpressionAttributeValues: {
                ':title': shortUrlUpdate.title,
            }
        }).promise();
    }

    async deleteShortUrl(shortUrlId: string, userId: string): Promise<void> {
        logger.info("Delete Short URL", {"shortUrlId": shortUrlId, 'userId': userId});

        await this.docClient
            .delete({
                TableName: this.shortUrlTable,
                Key: {
                    'userId': userId,
                    'urlId': shortUrlId
                },
                ConditionExpression: 'attribute_exists(urlId)',
            }).promise();
    }

}