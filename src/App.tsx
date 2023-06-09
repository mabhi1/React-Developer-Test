import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/public/Login";
import Register from "./components/public/Register";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./store/hooks";
import { initializeUser, updateUser } from "./store/slices/userSlice";
import PageNotFound from "./components/PageNotFound";
import Toast from "./ui/Toast";
import PublicRoute from "./components/routeHandlers/PublicRoutes";
import PrivateRoute from "./components/routeHandlers/PrivateRoutes";
import Profile from "./components/private/profile/Profile";
import LandingPage from "./components/private/LandingPage";
import CreatePost from "./components/private/post/CreatePost";
import { getUserPosts } from "./firebase/db/postDBFunctions";
import { addUserPost, initializeUsersPosts } from "./store/slices/userPostsSlice";
import UserPosts from "./components/private/post/UserPosts";
import ConfirmBox from "./ui/ConfirmBox";
import EditPost from "./components/private/post/EditPost";
import PublicProfile from "./components/private/profile/PublicProfile";
import { UserStateType } from "./utils/types";
import { getUser } from "./firebase/db/userDBFunctions";
import Spinner from "./ui/Spinner";
import Footer from "./components/Footer";

function App() {
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        async function queryUser(user: UserStateType) {
          const userPosts = await getUserPosts(user.uid!);
          const userData = await getUser(user.uid!);
          userPosts.forEach((post) => dispatch(addUserPost(post)));
          if (userData) dispatch(updateUser({ ...userData }));
          else
            dispatch(
              updateUser({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
              })
            );
          setLoading(false);
        }
        queryUser(user);
      } else {
        dispatch(initializeUser());
        dispatch(initializeUsersPosts());
      }
      setLoading(false);
    });
  }, []);
  return (
    <Router>
      <main className="font-body bg-slate-50 min-h-screen text-slate-900 flex flex-col text-base">
        {loading ? (
          <div className="flex-1 flex flex-col gap-3 justify-center items-center text-xl">
            <Spinner size="lg" />
            Please wait...
          </div>
        ) : (
          <>
            <Header />
            <div className="flex-1 flex flex-col p-5">
              <Routes>
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/create" element={<CreatePost />} />
                  <Route path="/edit-post" element={<EditPost />} />
                  <Route path="/myposts" element={<UserPosts />} />
                  <Route path="/user" element={<PublicProfile />} />
                </Route>
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
              <ConfirmBox />
              <Toast />
            </div>
            <Footer />
          </>
        )}
      </main>
    </Router>
  );
}

export default App;
