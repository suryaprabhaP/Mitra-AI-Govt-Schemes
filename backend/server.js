const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const schemeRoutes = require('./routes/schemes');
const conversationRoutes = require('./routes/conversation');
const applicationRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/schemes', schemeRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => {
  res.send('Mitra API is running...');
});

// Run normally if not inside AWS Lambda
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} and accessible on all network interfaces`);
  });
}

// Export the serverless app handler
module.exports.handler = serverless(app);
