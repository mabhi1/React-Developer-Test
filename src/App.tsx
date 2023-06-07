import Feed from "./components/Feed";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

const App = () => {
  return (
    <div className="font-body min-h-screen flex text-base">
      <Router>
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
