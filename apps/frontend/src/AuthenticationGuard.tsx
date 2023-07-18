import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ComponentType } from "react";

interface AuthenticationGuardProps {
  component: ComponentType<unknown>;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  component: Component,
}) => {
  const WrappedComponent = withAuthenticationRequired(Component);

  return <WrappedComponent />;
};
