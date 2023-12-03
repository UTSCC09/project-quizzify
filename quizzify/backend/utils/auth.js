// Source: https://github.com/auth0-developer-hub/api_express_javascript_hello-world/blob/main/src/middleware/auth0.middleware.js

const {
  auth,
  claimCheck,
  InsufficientScopeError,
} = require("express-oauth2-jwt-bearer");

const dotenv = require("dotenv");
dotenv.config();

const validateAccessToken = (authRequired) => {
  return (req, res, next) => {
    const authCheck = auth({
      issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
      audience: process.env.AUTH0_AUDIENCE,
      authRequired: authRequired // Let middleware send 401 errors
    })
    authCheck(req, res, next);
  }
}

const checkRequiredPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const permissionCheck = claimCheck((payload) => {
      const permissions = payload.permissions || [];
      const hasPermissions = requiredPermissions.every((requiredPermission) =>
        permissions.includes(requiredPermission)
      );

      if (!hasPermissions) throw new InsufficientScopeError();

      return hasPermissions;
    });
    permissionCheck(req, res, next);
  };
};

const getManagementToken = async () => {
  if (process.env.AUTH0_MANAGEMENT_TOKEN)
    return process.env.AUTH0_MANAGEMENT_TOKEN

  let response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      "client_id": process.env.AUTH0_API_EXPLORER_CLIENT_ID,
      "client_secret": process.env.AUTH0_API_EXPLORER_CLIENT_SECRET,
      "audience": `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      "grant_type": "client_credentials"})
  })
  return (await Promise.resolve(response.json()))["access_token"]
}

const getUsers = async () => {
  return fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, {
    method: 'GET',
    headers: { 
      'Accept': 'application/json',
      'Authorization': `Bearer ${await getManagementToken()}` 
    }
  }).then(response => response.json())
}

const getUserById = async (userId) => {
  return fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
    method: 'GET',
    headers: { 
      'Accept': 'application/json',
      'Authorization': `Bearer ${await getManagementToken()}` 
    }
  }).then(response => response.json())
}

module.exports = {
  validateAccessToken,
  checkRequiredPermissions,
  getUsers,
  getUserById,
};