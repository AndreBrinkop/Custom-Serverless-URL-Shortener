const AWS = require('aws-sdk');
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from "../utils/logger";

const logger = createLogger('UrlAccess')

export class UrlAccess {

    constructor(
        private readonly docClient: DocumentClient = AWS.DynamoDB.DocumentClient(),
        private readonly urlTable = process.env.URL_TABLE,
        private readonly configTable: string = process.env.CONFIG_TABLE){
    }

    async createUrlId(): Promise<number> {
        logger.info('Creating URL id');

        const response = await this.docClient.update({
            TableName: this.configTable,
            Key: {
                'configKey': "NextId"
            },
            UpdateExpression: 'SET configValue = if_not_exists(configValue, :zero) + :one',
            ExpressionAttributeValues: {
                ':one': 1,
                ':zero': 0
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();

        const urlId = response.Attributes['configValue']
        logger.info('Created URL id',{"urlId": urlId});
        return urlId
    }

}