import { useState } from "react";
import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import { showToast } from "../../../utils/handleToast";
import { createPost } from "../../../firebase/db/postDBFunctions";
import Spinner from "../../../ui/Spinner";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addUserPost } from "../../../store/slices/userPostsSlice";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const target = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
    };

    const title = target.title.value.trim();
    const description = target.description.value.trim();
    if (!title || !description) return;
    if (title === "" || description === "") {
      showToast("error", "Complete the form to continue");
    }
    try {
      setLoading(true);
      const currentPost = await createPost(user, title, description);
      if (currentPost) {
        dispatch(addUserPost(currentPost));
        target.title.value = "";
        target.description.value = "";
      }
      setLoading(false);
      showToast("success", "Post created successfully");
    } catch (error) {
      console.log(error);
      showToast("error", "Unable to create post");
      setLoading(false);
    }
  };

  return (
    <div className="lg:w-3/4 flex flex-col gap-5">
      <h2>Create a POST</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input wide="full" id="title" type="text" name="title" autoFocus placeholder="Enter Title" />
        <textarea
          name="description"
          id="description"
          placeholder="Enter Description"
          className="resize-none border-2 focus-visible:outline-none bg-slate-50 border-slate-400 rounded p-2 focus:border-cyan-900 w-full"
          rows={7}
        ></textarea>
        <div className="flex gap-5 w-full md:w-80 md:justify-start">
          {loading ? (
            <Button size="md" className="flex-1" variant="disabled">
              <Spinner size="sm" />
            </Button>
          ) : (
            <Button size="md" className="flex-1">
              Post
            </Button>
          )}

          <Button size="md" variant="destructive" type="reset" className="flex-1">
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};
export default CreatePost;
