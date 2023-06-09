import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./store/hooks";
import { updateUser } from "./store/slices/userSlice";
import PageNotFound from "./components/PageNotFound";
import Feed from "./components/Feed";
import Toast from "./ui/Toast";
import PublicRoute from "./components/routeHandlers/PublicRoutes";
import PrivateRoute from "./components/routeHandlers/PrivateRoutes";

function App() {
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLoading(false);
      dispatch(
        updateUser({
          name: user!.displayName,
          email: user!.email,
        })
      );
    });
  }, []);
  return (
    <Router>
      <main className="font-body bg-slate-50 min-h-screen text-slate-900 flex flex-col text-base">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <Header />
            <div className="flex-1 flex flex-col">
              <Routes>
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Feed />} />
                </Route>
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
              <Toast />
            </div>
          </>
        )}
      </main>
    </Router>
  );
}

export default App;
