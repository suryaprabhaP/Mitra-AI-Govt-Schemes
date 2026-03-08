const express = require('express');
const router = express.Router();
const { docClient } = require('../utils/dynamoClient');
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require('crypto');

const USERS_TABLE = "mitra-users";

// POST a new application
router.post('/submit', async (req, res) => {
    try {
        const applicationData = req.body;
        const applicationId = `app_${crypto.randomUUID()}`;

        const item = {
            applicationID: applicationId, // DynamoDB Partition Key (User created with capital D)
            applicationId: applicationId, // Kept for frontend backwards-compatibility
            timestamp: new Date().toISOString(),
            status: 'Submitted',
            ...applicationData
        };

        const command = new PutCommand({
            TableName: USERS_TABLE,
            Item: item
        });

        await docClient.send(command);
        res.status(201).json({ success: true, message: 'Application submitted successfully to AWS DynamoDB', applicationId: item.applicationId });
    } catch (error) {
        console.error("DynamoDB Submit Error:", error);
        res.status(500).json({ success: false, error: 'Failed to submit application to cloud database' });
    }
});

// GET all applications for the current user (Mocked with Scan for MVP purposes)
router.get('/', async (req, res) => {
    try {
        const { phone } = req.query;
        let command;

        if (phone) {
            command = new ScanCommand({
                TableName: USERS_TABLE,
                FilterExpression: "userPhone = :p OR phone = :p",
                ExpressionAttributeValues: {
                    ":p": phone
                }
            });
        } else {
            command = new ScanCommand({
                TableName: USERS_TABLE
            });
        }

        const response = await docClient.send(command);
        res.status(200).json(response.Items || []);
    } catch (error) {
        console.error("DynamoDB GET Error:", error);
        res.status(500).json({ success: false, error: 'Failed to retrieve applications from cloud database' });
    }
});

module.exports = router;
