# Custom Serverless URL Shortener
This application can be used to host a custom url shortener on your own domain using serverless and AWS.
The backend uses the Serverless framework to deploy the API on AWS and to create the needed Infrastructure to add storage and authentication.

## Backend
The backend folder contains the Serverless Application that can be completely automatically deployed to AWS.

## Frontend
The frontend folder contains an Angular App that can be used to connect and to interact with the backend API. It uses amplify to authenticate with the deployed Cognito User Pool and supports Listing, Creating, Modifiying and Deleting short urls.

### Running the Frontend
Before running the frontend you need to configure it to talk to your deployed backend resources. You can do this by adding the necessary values to the apps environment file that you can find in: `frontend/src/environments`.

E.g. a valid configuration can look like this:
```
  awsCognitoRegion: 'us-east-1',
  awsUserPoolsId: 'us-east-1_CkuRmjrkZ',
  awsUserPoolsWebClientId: '4r609qk6thbvru5esem68hjja7',
  shortUrlEndpoint: 'https://pp1d5gm4hl.execute-api.us-east-1.amazonaws.com/dev'
```

After updating the configuration you need to install the necessary dependencies by running the following command from within the frontend folder:
`npm install`

After installing the dependencies you can run the frontend app locally on port 4200 by running the following command while still being in the frontend folder:
`npm run start`
