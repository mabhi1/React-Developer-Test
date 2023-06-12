import { useState, useEffect } from "react";
import IndividualPost from "./post/IndividualPost";
import Suggestions from "./post/Suggestions";
import { useAppSelector } from "../../store/hooks";
import { PostType } from "../../utils/types";
import Spinner from "../../ui/Spinner";
import { getFeedPosts, getPostsByQuery } from "../../firebase/db/postDBFunctions";
import Input from "../../ui/Input";

const LandingPage = () => {
  const [posts, setPosts] = useState<PostType[] | []>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostType[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const user = useAppSelector((state) => state.user);
  useEffect(() => {
    async function queryFeedPosts() {
      const feedPosts = await getFeedPosts(user.following!);
      setPosts(feedPosts);
      setLoading(false);
    }
    queryFeedPosts();
  }, [user]);

  const handleChange = async (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.target as typeof e.target & { value: string };
    setSearchTerm(value);
    setSearching(true);
    const postsData = await getPostsByQuery(value.toLowerCase());
    setFilteredPosts(postsData);
    setSearching(false);
  };

  const displayPosts = (postList: PostType[]) => {
    return postList.map((post) => (
      <span key={post.id}>
        <IndividualPost currentUser={user.uid!} photoURL={user.photoURL!} userPost={post} />
      </span>
    ));
  };

  if (user.uid === null || loading) return <Spinner size="lg" />;
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex flex-col gap-5 lg:w-4/5">
        <div>Your Feed</div>
        <Input type="text" placeholder="Search post title" value={searchTerm} onChange={handleChange} />
        {searching ? (
          <div>
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {posts.length === 0 && <div>You do not follow anyone. Follow users to get their posts on your feed.</div>}
            {searchTerm.length > 0 && filteredPosts.length > 0 && displayPosts(filteredPosts)}
            {searchTerm.length > 0 && filteredPosts.length === 0 && <div>No Posts found</div>}
            {searchTerm.length === 0 && displayPosts(posts)}
          </>
        )}
      </div>
      <Suggestions />
    </div>
  );
};

export default LandingPage;
