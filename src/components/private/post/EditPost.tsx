import { useState, useEffect } from "react";
import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import { v4 as uuidV4 } from "uuid";
import { showToast } from "../../../utils/handleToast";
import { updatePost } from "../../../firebase/db/postDBFunctions";
import Spinner from "../../../ui/Spinner";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addUserPost } from "../../../store/slices/userPostsSlice";
import { useSearchParams } from "react-router-dom";
import { uploadFile } from "../../../firebase/storageFunctions";
import { getDownloadURL } from "firebase/storage";
import moment from "moment";
import { BiDislike, BiLike } from "react-icons/bi";

const EditPost = () => {
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [searchParams] = useSearchParams();
  const postId: string | null = searchParams.get("id");
  const post = useAppSelector((state) => state.userPosts).find((post) => post.id === postId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (post) {
      setLoading(false);
      setTitle(post.title);
      setDescription(post.description);
    }
  }, [post]);

  const handleReset = () => {
    setTitle(post!.title);
    setDescription(post!.description);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length === 0 || description.trim().length === 0) {
      showToast("error", "Title or Description invalid");
      return;
    }
    if (title.trim() === post?.title && description.trim() === post.description) {
      showToast("info", "No change in title or description");
      return;
    }
    e.preventDefault();
  };

  const handleUpload = () => {
    const imageId = uuidV4();
    if (imageUploading) return;

    const { files } = document.getElementById("file") as HTMLInputElement;
    if (!files || files.length <= 0) return;
    setImageUploading(true);

    // 'file' comes from the Blob or File API
    const { uploadTask, storageRef } = uploadFile(imageId, files[0]);

    try {
      uploadTask.on(
        "state_changed",
        () => {},
        () => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async () => {
            const url = await getDownloadURL(storageRef);
            const res = await updatePost({ id: post!.id, imageURL: url });
            if (!res) throw new Error();
            showToast("success", `Image uploaded successfully`);
            const newImageList = [...post!.images, url];
            dispatch(addUserPost({ ...post!, images: newImageList, updatedAt: Date.now() }));
            setImageUploading(false);
            (document.getElementById("file") as HTMLInputElement).value = "";
          });
        }
      );
    } catch (error) {
      showToast("error", `Error uploading Image`);
      setImageUploading(false);
      console.error(error);
    }
  };

  if (!post) return <Spinner size="lg" />;
  else
    return (
      <div className="lg:w-3/4 flex flex-col gap-5">
        <h2>Edit POST</h2>
        <div className="flex gap-2 items-center">
          <span className="text-sm border-r-2 border-slate-500 pr-2 text-slate-500 italic">
            Created: {moment(post?.createdAt).fromNow()}
          </span>
          <span className="text-sm text-slate-500 italic">Updated: {moment(post?.updatedAt).fromNow()}</span>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            wide="full"
            id="title"
            type="text"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
          />
          <textarea
            name="description"
            id="description"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none border-2 focus-visible:outline-none bg-slate-50 border-slate-400 rounded p-2 focus:border-cyan-900 w-full"
            rows={7}
          ></textarea>
          <div className="flex">
            <Input wide={"lg"} type="file" id="file" name="file" className="w-full p-0 border-0" accept="image/*" />
            {imageUploading ? (
              <Button variant={"disabled"} disabled>
                <span className="hidden md:inline mr-1">Please </span>Wait...
              </Button>
            ) : (
              <Button type="button" onClick={handleUpload}>
                Upload
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-5">
            {post?.images.map((image) => (
              <div key={image}>
                <img src={image} className="max-h-40 w-auto" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 items-center">
              <BiLike />
              <span>{post?.likes.length}</span>
            </div>
            <div className="flex gap-1 items-center">
              <BiDislike />
              <span>{post?.dislikes.length}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3>Comments : {post?.comments.length === 0 ? "This Post has 0 Comments" : post?.comments.length}</h3>
            {post?.comments.map((comment) => (
              <div className="flex gap-2">
                <img src={comment.photoURL} alt="profile" width="40" className="max-h-[40px]" />
                <div className="flex flex-col">
                  <p>{comment.comment}</p>
                  <span className="text-sm text-slate-500 italic">{comment.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-5 w-full md:w-80 md:justify-start">
            {loading ? (
              <Button size="md" className="flex-1" variant="disabled" disabled>
                <Spinner size="sm" />
              </Button>
            ) : (
              <Button size="md" className="flex-1">
                Save
              </Button>
            )}

            <Button size="md" variant="destructive" type="reset" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    );
};
export default EditPost;
