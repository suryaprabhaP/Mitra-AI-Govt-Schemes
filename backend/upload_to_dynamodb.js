require('dotenv').config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const fs = require('fs');
const path = require('path');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "schemasahayak-schemes";
const JSON_FILE_PATH = path.join(__dirname, 'data', 'schemes_database.json');

async function uploadData() {
    try {
        console.log(`Reading data from ${JSON_FILE_PATH}...`);
        const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf8');
        const schemes = JSON.parse(rawData);

        console.log(`Found ${schemes.length} schemes. Starting upload to DynamoDB table: ${TABLE_NAME}...`);

        let count = 0;
        for (const scheme of schemes) {
            if (!scheme.id) {
                scheme.id = `scheme_${count + 1}`;
            }

            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: scheme,
            });

            await docClient.send(command);
            count++;
            console.log(`Uploaded ${count}/${schemes.length}: ${scheme.name}`);
        }

        console.log("✅ Successfully uploaded all schemes to DynamoDB!");

    } catch (error) {
        console.error("❌ Error uploading data:", error);
    }
}

uploadData();
