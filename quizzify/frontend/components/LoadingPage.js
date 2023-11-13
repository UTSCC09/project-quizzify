// Source: https://github.com/auth0-developer-hub/spa_react_javascript_hello-world/blob/basic-authentication-with-api-integration/src/components/page-loader.js

import React from "react";

export const LoadingPage = () => {
  const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

  return (
    <div className="loader">
      <img src={loadingImg} alt="Loading..." />
    </div>
  );
};