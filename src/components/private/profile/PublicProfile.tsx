import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { getUser } from "../../../firebase/db/userDBFunctions";
import { createdDBUserType } from "../../../utils/types";
import Spinner from "../../../ui/Spinner";

const PublicProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId: string | null = searchParams.get("id");
  const loggedInUser = useAppSelector((state) => state.user);
  const [user, setUser] = useState<createdDBUserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || loggedInUser.uid === userId) navigate("/profile");
    async function queryUser() {
      if (!userId) return;
      const res = await getUser(userId);
      if (!res) navigate("/user-not-found");
      setUser(res);
      setLoading(false);
    }
    queryUser();
  }, [userId, loggedInUser]);

  if (loading) return <Spinner size="lg" />;
  else if (user)
    return (
      <div className="flex flex-col gap-3 md:gap-5">
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
        <div className="flex flex-col gap-1">
          <div>Name : {user.displayName}</div>
          <div>Email : {user.email}</div>
        </div>
      </div>
    );
};
export default PublicProfile;
