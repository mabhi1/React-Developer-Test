import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";

const PublicRoute = () => {
  const auth = getAuth();
  return auth.currentUser ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
