import { Link, useNavigate } from "react-router-dom";
import { MdOutlineFeed, MdLogout } from "react-icons/md";
import { FaUserTag, FaUserPlus } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { dosignOut } from "../firebase/firebaseFunctions";
import { updateUser } from "../store/slices/userSlice";
import Button from "../ui/Button";

const menuItems = [
  {
    label: "Feed",
    path: "/",
    icon: <MdOutlineFeed />,
    authRequired: true,
  },
  {
    label: "Login",
    path: "/login",
    icon: <FaUserTag />,
    authRequired: false,
  },
  {
    label: "Register",
    path: "/register",
    icon: <FaUserPlus />,
    authRequired: false,
  },
];
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const handleLogout = async () => {
    await dosignOut();
    dispatch(updateUser({ name: null, email: null }));
    navigate("/login");
  };

  return (
    <div className="flex border-r-2 justify-between py-5 px-10 items-center border-b border-slate-300">
      <h1 className="text-lg">Socialize</h1>
      <nav className="flex gap-8 items-center">
        {user.name && (
          <div className="hidden md:flex justify-center items-center md:min-h-full">Welcome, {user.name}</div>
        )}
        {menuItems.map((item) => (
          <Link
            to={item.path}
            className={`${
              !item.authRequired != !user.name && "hidden"
            } flex h-fit relative items-center gap-1 after:content-[''] after:absolute after:bg-slate-900 dark:after:bg-slate-50 after:h-0.5 after:left-0 after:w-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        {user.name && (
          <Button variant="link" onClick={handleLogout} className="flex gap-1 items-center">
            <MdLogout />
            Logout
          </Button>
        )}
      </nav>
    </div>
  );
};

export default Header;
