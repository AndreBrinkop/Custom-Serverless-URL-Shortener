import {ShortUrlItem} from "../models/ShortUrlItem";

const AWS = require('aws-sdk');
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from "../utils/logger";
import {ShortUrlUpdate} from "../models/ShortUrlUpdate";

const logger = createLogger('ShortUrlAccess')

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
            .query({
                TableName: this.shortUrlTable,
                IndexName: this.shortUrlIdIndex,
                KeyConditionExpression: 'urlId = :shortUrlId',
                ExpressionAttributeValues: {
                    ':shortUrlId': shortUrlId
                }
            })
            .promise()
        console.log('HERE', result.Items[0])
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
                }
            }).promise();
    }

}