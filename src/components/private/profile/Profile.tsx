import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import Button from "../../../ui/Button";
import { dosignOut } from "../../../firebase/authFunctions";
import { useNavigate } from "react-router-dom";
import ChangeName from "./ChangeName";
import { updateUser } from "../../../store/slices/userSlice";
import { UserStateType } from "../../../utils/types";
import ChangePassword from "./ChangePassword";
import ChangePhoto from "./ChangePhoto";

const Profile = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dosignOut();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const setUser = ({ uid, displayName, photoURL, email }: UserStateType) => {
    dispatch(
      updateUser({
        uid,
        displayName,
        photoURL,
        email,
      })
    );
  };

  return (
    <div className="flex flex-col gap-3 md:gap-5">
      <div className="flex justify-between items-start">
        {user?.photoURL ? (
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden flex">
            <img
              src={user.photoURL}
              width={100}
              height={100}
              alt={user.email || ""}
              className="object-cover object-center"
            />
          </div>
        ) : (
          <img src="/profile.png" width={100} height={100} alt={user.email || ""} />
        )}
        <span className="flex flex-col md:flex-row gap-2 md:gap-5">
          <Button onClick={() => navigate("/myposts")}>Your Posts</Button>
          <Button variant={"destructive"} onClick={handleLogout}>
            Logout
          </Button>
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div>Name : {user.displayName}</div>
        <div>Email : {user.email}</div>
      </div>
      <ChangeName user={user} setUser={setUser} />
      <ChangePhoto user={user} setUser={setUser} />
      <ChangePassword user={user} />
    </div>
  );
};
export default Profile;