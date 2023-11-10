'use strict';

require('dotenv').config({ path: ".env" }); // Ensure to pass NODE_ENV=development or NODE_ENV=production when running

const config = {
    "backend_base_url": process.env.BACKEND_BASE_URL,
    "frontend_base_url": process.env.FRONTEND_BASE_URL,
    "mongodb_uri": process.env.MONGODB_URI,
    
    "auth0": {
        "client_id": process.env.AUTH0_CLIENT_ID,
        "issuer_base_url": process.env.AUTH0_ISSUER_BASE_URL,
        "secret": process.env.AUTH0_SECRET,
    }
}

module.exports = config;