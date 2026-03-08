const fs = require('fs');
const path = require('path');
const { docClient } = require('./dynamoClient');
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

let schemesDatabase = [];

async function loadSchemesCache() {
    if (schemesDatabase.length > 0) return; // already loaded

    console.log("Loading schemes database from AWS DynamoDB...");
    try {
        const command = new ScanCommand({ TableName: "mitra-schemes" });
        const response = await docClient.send(command);
        const parsed = response.Items || [];

        schemesDatabase = parsed.map((s) => {
            const textBlob = [
                s.name,
                s.name_hi,
                s.category,
                s.description,
                s.benefit
            ].filter(Boolean).join(' ');

            const words = new Set(
                textBlob
                    .toLowerCase()
                    .split(/\W+/)
                    .filter(w => w.length > 2)
            );

            const content = `${s.name || ''}\n${s.description || ''}\nCategory: ${s.category || ''}`;

            return {
                ...s,
                content,
                words
            };
        });

        console.log(`Loaded ${schemesDatabase.length} schemes into cache from DynamoDB.`);
    } catch (err) {
        console.error("Error loading schemes from DynamoDB:", err);
        schemesDatabase = [];
    }
}

function searchSchemes(query, topK = 3, userProfile = null) {
    if (schemesDatabase.length === 0) return [];

    const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    if (queryWords.length === 0) return [];

    // Score based on how many query words appear in the scheme content
    const scoredSchemes = schemesDatabase.map(scheme => {
        let score = 0;
        for (const qw of queryWords) {
            if (scheme.words.has(qw)) {
                score += 1;
            }
        }

        // Add eligibility bonus
        let matchScore = 0;
        let reasons = [];
        if (userProfile) {
            const contentLC = scheme.content.toLowerCase();
            if (userProfile.state && contentLC.includes(userProfile.state.toLowerCase())) {
                matchScore += 1;
                score += 10;
                reasons.push(userProfile.state);
            }
            if (userProfile.occupation && contentLC.includes(userProfile.occupation.toLowerCase())) {
                matchScore += 1;
                score += 10;
                reasons.push(userProfile.occupation);
            }
            // Cannot reliably regex match age/income against unstructured text, so we assume partial check if text has digits
        }

        return { scheme, score, matchScore, reasons };
    });

    // Sort by score descending
    scoredSchemes.sort((a, b) => b.score - a.score);

    // Filter out zero scores and take topK
    const bestMatches = scoredSchemes.filter(s => s.score > 0).slice(0, topK);
    return bestMatches.map(m => ({
        ...m.scheme,
        matchScore: m.matchScore,
        reasons: m.reasons
    }));
}

function getSchemesDatabase() {
    return schemesDatabase;
}

module.exports = {
    loadSchemesCache,
    searchSchemes,
    getSchemesDatabase
};
