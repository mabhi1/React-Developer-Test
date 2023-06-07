import { Link } from "react-router-dom";

const classes = {
  menuItem: "py-3 px-8 hover:bg-slate-200",
};
const Header = () => {
  return (
    <div className="flex flex-col border-r-2">
      <div className="flex items-center gap-2 p-5">
        <img src="/icon.ico" alt="socialize" className="w-16 h-auto" />
        <h1 className="text-xl">Socialize</h1>
      </div>
      <div className="flex flex-col">
        <Link to="/" className={classes.menuItem}>
          Feed
        </Link>
        <Link to="/signin" className={classes.menuItem}>
          Signin
        </Link>
        <Link to="/signup" className={classes.menuItem}>
          Signup
        </Link>
        <Link to="/" className={classes.menuItem}>
          Feed
        </Link>
      </div>
    </div>
  );
};

export default Header;
