'use strict';

require('dotenv').config({ path: ".env" }); // Ensure to pass NODE_ENV=development or NODE_ENV=production when running

const config = {
    "frontend_base_url": process.env.FRONTEND_BASE_URL,
    "mongodb_uri": process.env.MONGODB_URI,
}

module.exports = config;