import { useState } from "react";
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import { PostType } from "../../../utils/types";
import moment from "moment";
import { Link } from "react-router-dom";
import { dislikePost, likePost, updatePost } from "../../../firebase/db/postDBFunctions";
import Spinner from "../../../ui/Spinner";

const IndividualPost = ({
  userPost,
  currentUser,
  photoURL,
}: {
  userPost: PostType;
  currentUser: string;
  photoURL: string;
}) => {
  const [post, setPost] = useState(userPost);
  const [comment, setComment] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const handleLike = async () => {
    setLikeLoading(true);
    await likePost(currentUser, post.id);
    const newDislikeList = post.dislikes.filter((user) => user !== currentUser);
    let newLikeList = post.likes;
    if (newLikeList.includes(currentUser)) newLikeList = newLikeList.filter((user) => user !== currentUser);
    else newLikeList.push(currentUser);
    setPost({ ...post, likes: newLikeList, dislikes: newDislikeList });
    setLikeLoading(false);
  };

  const handleDislike = async () => {
    setDislikeLoading(true);
    await dislikePost(currentUser, post.id);
    const newLikeList = post.likes.filter((user) => user !== currentUser);
    let newDislikeList = post.dislikes;
    if (newDislikeList.includes(currentUser)) newDislikeList = newDislikeList.filter((user) => user !== currentUser);
    else newDislikeList.push(currentUser);
    setPost({ ...post, likes: newLikeList, dislikes: newDislikeList });
    setDislikeLoading(false);
  };

  const handleComments = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentLoading) return;
    if (!comment || comment.trim() === "") return;
    setCommentLoading(true);
    await updatePost({
      id: post.id,
      comment: { userId: currentUser, createdAt: Date.now(), comment: comment.trim(), photoURL },
    });
    const newComments = post.comments;
    newComments.push({ userId: currentUser, createdAt: Date.now(), comment: comment.trim(), photoURL });
    setPost({ ...post, comments: post.comments });
    setCommentLoading(false);
  };

  if (!post) return <div>lasd</div>;
  return (
    <div className="flex flex-col gap-5 shadow p-5 rounded bg-slate-100">
      <div className="flex gap-2 items-center">
        <img src={post.uploadedBy.photoURL} alt="profile" width="40" className="rounded-full max-h-[40px]" />
        <Link
          to={`/user?id=${post.uploadedBy.userId}`}
          className="underline underline-offset-2 text-slate-500 text-sm border-r-2 border-slate-500 pr-2"
        >
          {post.uploadedBy.name}
        </Link>
        <span className="text-sm text-slate-500 italic">{moment(post.createdAt).fromNow()}</span>
      </div>
      <h2 className="text-2xl">{post.title}</h2>
      <div>{post.description}</div>
      <div className="flex flex-wrap gap-5">
        {post.images.map((image) => (
          <div key={image}>
            <img src={image} className="max-h-40 w-auto" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex gap-1 items-center">
          {likeLoading ? (
            <Spinner size="sm" />
          ) : post.likes.includes(currentUser) ? (
            <AiFillLike onClick={handleLike} className="cursor-pointer" />
          ) : (
            <AiOutlineLike onClick={handleLike} className="cursor-pointer" />
          )}
          <span>{post.likes.length}</span>
        </div>
        <div className="flex gap-1 items-center">
          {dislikeLoading ? (
            <Spinner size="sm" />
          ) : post.dislikes.includes(currentUser) ? (
            <AiFillDislike onClick={handleDislike} className="cursor-pointer" />
          ) : (
            <AiOutlineDislike onClick={handleDislike} className="cursor-pointer" />
          )}
          <span>{post.dislikes.length}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3>Comments : </h3>
        {post.comments.map((comment, idx) => (
          <div key={idx} className="flex gap-2">
            <Link to={`/user?id=${comment.userId}`}>
              <img src={comment.photoURL} alt="profile" width="40" className="rounded-full max-h-[40px]" />
            </Link>
            <div className="flex flex-col">
              <p>{comment.comment}</p>
              <span className="text-sm text-slate-500 italic">{moment(comment.createdAt).fromNow()}</span>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <img src={photoURL} alt="profile" width="40" className="rounded-full max-h-[40px]" />
          <form className="relative" onSubmit={handleComments}>
            <Input
              type="text"
              wide="lg"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-full pr-14"
            />
            {commentLoading ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <Spinner size="sm" />
              </span>
            ) : (
              <Button
                type="submit"
                variant="ghost"
                className="absolute right-3 top-1/2 -translate-y-1/2 border-l-2 border-slate-500 rounded-none pl-2 text-cyan-800"
              >
                Post
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default IndividualPost;
