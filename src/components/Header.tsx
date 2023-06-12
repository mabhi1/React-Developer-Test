import { Link, useNavigate } from "react-router-dom";
import { MdOutlineFeed, MdLogout, MdPostAdd } from "react-icons/md";
import { FaUserTag, FaUserPlus } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { dosignOut } from "../firebase/authFunctions";
import { updateUser } from "../store/slices/userSlice";
import Button from "../ui/Button";

const authMenuItems = [
  {
    label: "Feed",
    path: "/",
    icon: <MdOutlineFeed />,
  },
  {
    label: "Create",
    path: "/create",
    icon: <MdPostAdd />,
  },
];

const nonAuthMenuItems = [
  {
    label: "Login",
    path: "/login",
    icon: <FaUserTag />,
  },
  {
    label: "Register",
    path: "/register",
    icon: <FaUserPlus />,
  },
];
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const handleLogout = async () => {
    await dosignOut();
    dispatch(updateUser({ uid: null, displayName: null, email: null, photoURL: null }));
    navigate("/login");
  };

  if (user.uid)
    return (
      <div className="flex flex-col md:flex-row gap-3 sticky top-0 bg-slate-50/80 z-40 backdrop-blur justify-between py-3 px-10 items-center border-b border-slate-300">
        <h1 className="text-lg">Socialize</h1>
        <nav className="flex gap-8 items-center">
          <div className="hidden md:flex justify-center items-center md:min-h-full">Welcome, {user.displayName}</div>

          {authMenuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex h-fit relative items-center gap-1 after:content-[''] after:absolute after:bg-slate-900 after:h-0.5 after:left-0 after:w-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <>
            <Button variant="link" onClick={handleLogout} className="flex gap-1 items-center">
              <MdLogout />
              Logout
            </Button>
            <Link to="/profile">
              {user.photoURL ? (
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex">
                  <img
                    src={user.photoURL}
                    width={40}
                    height={40}
                    alt={user.email || "User"}
                    className="object-center object-cover"
                  />
                </div>
              ) : (
                <img src="/profile.png" width={50} height={50} alt={user.email || "User"} />
              )}
            </Link>
          </>
        </nav>
      </div>
    );
  else
    return (
      <div className="flex flex-col md:flex-row gap-3 justify-between py-3 px-10 items-center border-b border-slate-300">
        <h1 className="text-lg">Socialize</h1>
        <nav className="flex gap-8 items-center">
          {nonAuthMenuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex h-fit relative items-center gap-1 after:content-[''] after:absolute after:bg-slate-900 after:h-0.5 after:left-0 after:w-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    );
};

export default Header;
