import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.tsx";
import { JSX } from "react/jsx-runtime";

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
