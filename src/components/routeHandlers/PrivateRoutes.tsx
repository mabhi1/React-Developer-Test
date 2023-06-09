import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";

const PrivateRoute = () => {
  const auth = getAuth();
  return auth.currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
