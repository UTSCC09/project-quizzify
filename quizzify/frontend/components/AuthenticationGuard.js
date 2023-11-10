// Source: https://github.com/auth0-developer-hub/spa_react_javascript_hello-world/blob/basic-authentication-with-api-integration/src/components/authentication-guard.js

import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { LoadingPage } from "./LoadingPage";

export const AuthenticationGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
        <LoadingPage />
      </div>
    ),
  });

  return <Component />;
};