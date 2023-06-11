import { useState, useEffect } from "react";
import { BiLike, BiDislike } from "react-icons/bi";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPost } from "../../../firebase/db/postDBFunctions";
import { PostType } from "../../../utils/types";
import Spinner from "../../../ui/Spinner";
import moment from "moment";

const PostQueryPage = () => {
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const postId: string | null = searchParams.get("id");

  useEffect(() => {
    async function queryPost() {
      if (postId === null) {
        navigate("/");
        return;
      }
      const data = await getPost(postId);
      if (data) setPost(data);
      else navigate("/post-not-found");
      setLoading(false);
    }
    queryPost();
  }, [postId]);

  if (loading)
    return (
      <div>
        <Spinner size="lg" />
      </div>
    );
  else if (post)
    return (
      <div className="flex flex-col gap-5 shadow p-5 rounded bg-slate-100">
        <div className="flex gap-2 items-center">
          <img src={post.uploadedBy.photoURL} alt="profile" width="40" className="rounded-full max-h-[40px]" />
          <span className="underline underline-offset-2 text-slate-500 text-sm border-r-2 border-slate-500 pr-2">
            {post.uploadedBy.name}
          </span>
          <span className="text-sm text-slate-500 italic">{moment(post.createdAt).fromNow()}</span>
        </div>
        <h2 className="text-2xl">{post.title}</h2>
        <div>
          {post.description.split("\n").map((i, key) => {
            return <div key={key}>{i}</div>;
          })}
        </div>
        <div className="flex flex-wrap gap-5">
          {post.images.map((image) => (
            <div key={image}>
              <img src={image} className="max-h-40 w-auto" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 items-center">
            <BiLike />
            <span>{post.likes.length}</span>
          </div>
          <div className="flex gap-1 items-center">
            <BiDislike />
            <span>{post.dislikes.length}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3>Comments : </h3>
          {post.comments.map((comment) => (
            <div className="flex gap-2">
              <img src={comment.photoURL} alt="profile" width="40" className="max-h-[40px]" />
              <div className="flex flex-col">
                <p>{comment.comment}</p>
                <span className="text-sm text-slate-500 italic">{comment.createdAt}</span>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <img src="/profile.png" alt="profile" width="40" className="max-h-[40px]" />
            <form className="relative">
              <Input type="text" wide="lg" className="rounded-full pr-14" />
              <Button
                variant="ghost"
                className="absolute right-3 top-1/2 -translate-y-1/2 border-l-2 border-slate-500 rounded-none pl-2 text-cyan-800"
              >
                Post
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
};
export default PostQueryPage;
