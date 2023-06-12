import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { followUser, getUser, unfollowUser } from "../../../firebase/db/userDBFunctions";
import { PostType, createdDBUserType } from "../../../utils/types";
import Spinner from "../../../ui/Spinner";
import Button from "../../../ui/Button";
import { getUserPosts } from "../../../firebase/db/postDBFunctions";
import IndividualPost from "../post/IndividualPost";
import { showToast } from "../../../utils/handleToast";
import { useDispatch } from "react-redux";
import { addFollowing, removeFollowing } from "../../../store/slices/userSlice";

const PublicProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId: string | null = searchParams.get("id");
  const loggedInUser = useAppSelector((state) => state.user);
  const [user, setUser] = useState<createdDBUserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<PostType[] | []>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId || loggedInUser.uid === userId) navigate("/profile");
    async function queryUser() {
      if (!userId) return;
      const res = await getUser(userId);
      if (!res) navigate("/user-not-found");
      const posts: PostType[] = await getUserPosts(userId);
      setUser(res);
      setUserPosts(posts);
      setLoading(false);
    }
    queryUser();
  }, [userId, loggedInUser]);

  const handleFollow = async () => {
    if (!user || !loggedInUser.uid) return;
    setLoading(true);
    try {
      await followUser(userId!, loggedInUser.uid!);
      const newFollowedByList = [...user.followedBy, loggedInUser.uid];
      setUser({ ...user, followedBy: newFollowedByList });
      showToast("success", `You are now following ${user?.displayName}`);
      dispatch(addFollowing(user.uid));
    } catch (error) {
      showToast("error", "Unable to follow");
    }
    setLoading(false);
  };
  const handleUnfollow = async () => {
    if (!user || !loggedInUser.uid) return;
    setLoading(true);
    try {
      await unfollowUser(userId!, loggedInUser.uid!);
      const newFollowedByList = user.followedBy.filter((follower) => follower !== loggedInUser.uid);
      setUser({ ...user, followedBy: newFollowedByList });
      showToast("success", `You unfollowed ${user?.displayName}`);
      dispatch(removeFollowing(user.uid));
    } catch (error) {
      showToast("error", "Unable to unfollow");
    }
    setLoading(false);
  };

  if (loading) return <Spinner size="lg" />;
  else if (user)
    return (
      <div className="flex flex-col gap-3 md:gap-5">
        <div className="flex justify-between items-start">
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
          <div className="flex items-center gap-3 md:gap-5 divide-x-2 divide-slate-400">
            <div>Followers : {user.followedBy.length}</div>
            <div className="pl-3 md:pl-5">Following : {user.following.length}</div>
            {user.followedBy.includes(loggedInUser.uid as never) ? (
              <Button variant="destructive" onClick={handleUnfollow}>
                Unfollow
              </Button>
            ) : (
              <Button onClick={handleFollow}>Follow</Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="border-t-2 pt-3 text-lg underline underline-offset-2">
            User Posts : <span>{userPosts.length}</span>
          </div>
          {userPosts.length > 0 &&
            userPosts.map((post) => (
              <IndividualPost
                key={post.id}
                userPost={post}
                currentUser={loggedInUser.uid!}
                photoURL={loggedInUser.photoURL!}
              />
            ))}
        </div>
      </div>
    );
};
export default PublicProfile;
