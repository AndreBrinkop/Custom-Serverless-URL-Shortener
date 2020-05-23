# Custom-Serverless-URL-Shortener
This application can be used to host a custom url shortener on your own domain using serverless and AWS.
The backend uses the Serverless framework to deploy the API on AWS and to create the needed Infrastructure to add storage and authentication.

## Backend
The backend folder contains the Serverless Application that can be completely automatically deployed to AWS.

## Frontend
The frontend folder contains an Angular App that can be used to connect and to interact with the backend API. It uses amplify to authenticate with the deployed Cognito User Pool and supports Listing, Creating, Modifiying and Deleting short urls.
