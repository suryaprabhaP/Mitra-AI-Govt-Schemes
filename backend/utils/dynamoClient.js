const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Configure the AWS Client
// In AWS Lambda, this uses the Lambda function's IAM role automatically.
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1"
});

const docClient = DynamoDBDocumentClient.from(client);

module.exports = { docClient };
