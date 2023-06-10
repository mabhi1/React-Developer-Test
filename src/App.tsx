import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/public/Login";
import Register from "./components/public/Register";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./store/hooks";
import { updateUser } from "./store/slices/userSlice";
import PageNotFound from "./components/PageNotFound";
import Toast from "./ui/Toast";
import PublicRoute from "./components/routeHandlers/PublicRoutes";
import PrivateRoute from "./components/routeHandlers/PrivateRoutes";
import Profile from "./components/private/Profile";
import Posts from "./components/private/Posts";

function App() {
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      dispatch(
        updateUser({
          uid: user ? user.uid : null,
          name: user ? user.displayName : null,
          email: user ? user.email : null,
          photoURL: user ? user.photoURL : null,
        })
      );
      setLoading(false);
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
            <div className="flex-1 flex flex-col p-10">
              <Routes>
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Posts />} />
                  <Route path="/profile" element={<Profile />} />
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
