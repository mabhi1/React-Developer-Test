import { BiLike, BiDislike } from "react-icons/bi";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Button from "../../../ui/Button";
import { deletePost } from "../../../firebase/db/postDBFunctions";
import { useState } from "react";
import Spinner from "../../../ui/Spinner";
import { removeUserPost } from "../../../store/slices/userPostsSlice";
import { openConfirmBox } from "../../../utils/handleConfirmBox";
import { showToast } from "../../../utils/handleToast";
import { Link, useNavigate } from "react-router-dom";

const UserPosts = () => {
  const userPosts = useAppSelector((state) => state.userPosts);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deletePost(id);
      dispatch(removeUserPost(id));
      showToast("success", "Post successfully deleted");
    } catch (error) {
      showToast("error", "Error deleting Post");
    }
    setLoading(false);
  };

  if (loading) return <Spinner size="lg" />;
  else
    return (
      <div className="flex flex-col gap-5">
        {userPosts.length === 0 && <div className="text-center">You have created 0 posts.</div>}
        {userPosts.map((post) => (
          <div id={post.id} className="flex flex-col gap-5 shadow p-5 rounded bg-slate-100" key={post.id}>
            <div className="flex gap-2 items-center">
              <img src={post.uploadedBy.photoURL} alt="profile" width="40" className="rounded-full max-h-[40px]" />
              <span className="underline underline-offset-2 text-slate-500 text-sm border-r-2 border-slate-500 pr-2">
                {post.uploadedBy.name}
              </span>
              <span className="text-sm text-slate-500 border-r-2 border-slate-500 pr-2 italic">
                Created: {moment(post.createdAt).fromNow()}
              </span>
              <span className="text-sm text-slate-500 italic">Updated: {moment(post.updatedAt).fromNow()}</span>
              <Button variant="link" className="ml-auto" onClick={() => navigate(`/edit-post?id=${post.id}`)}>
                Edit
              </Button>
              <Button
                variant="link"
                className="text-red-800 after:bg-red-800"
                onClick={() => openConfirmBox(() => handleDelete(post.id))}
              >
                Delete
              </Button>
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
              <h3>Comments : {post.comments.length === 0 && "This Post has 0 Comments"}</h3>
              {post.comments.map((comment) => (
                <div className="flex gap-2">
                  <Link to={`/user?id=${comment.userId}`}>
                    <img src={comment.photoURL} alt="profile" width="40" className="rounded-full max-h-[40px]" />
                  </Link>
                  <div className="flex flex-col">
                    <p>{comment.comment}</p>
                    <span className="text-sm text-slate-500 italic">{moment(comment.createdAt).fromNow()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
};
export default UserPosts;
