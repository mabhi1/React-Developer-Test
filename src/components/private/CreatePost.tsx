import { collection, getDocs, query, getFirestore } from "firebase/firestore";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useEffect, useState } from "react";

const CreatePost = () => {
  const db = getFirestore();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function getPosts() {
      const newFolders: any = [];
      const folderQuery = query(collection(db, "posts"));
      const folderSnapshot = await getDocs(folderQuery);
      folderSnapshot.forEach((doc) => {
        newFolders.push({ ...doc.data() });
      });
      setPosts(newFolders);
    }
    getPosts();
  }, []);

  return (
    <div className="lg:w-3/4 flex flex-col gap-5">
      {posts.map((post: any) => (
        <div key={post.name}>{post?.name}</div>
      ))}
      <h2>Create a POST</h2>
      <form className="flex flex-col gap-3">
        <Input wide="full" id="title" type="text" name="title" autoFocus placeholder="Enter Title" />
        <textarea
          name="description"
          id="description"
          placeholder="Enter Description"
          className="resize-none border-2 focus-visible:outline-none bg-slate-50 border-slate-400 rounded p-2 focus:border-cyan-900 w-full"
          rows={7}
        ></textarea>
        <div className="flex w-fit">
          <Input wide={"lg"} type="file" id="file" name="file" className="w-full p-0 border-0" accept="image/*" />
          <Button type="button" variant="outline">
            Upload
          </Button>
        </div>
        <div>
          Total images added : <span>0</span>
        </div>
        <div className="flex flex-wrap gap-5">
          {/* <img src="/register-img.png" className="max-h-40 w-auto" />
          <img src="/register-img.png" className="max-h-40 w-auto" />
          <img src="/register-img.png" className="max-h-40 w-auto" /> */}
        </div>
        <div className="flex gap-5 w-full md:w-80 md:justify-start">
          <Button size="md" className="flex-1">
            Post
          </Button>
          <Button size="md" variant="destructive" type="reset" className="flex-1">
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};
export default CreatePost;
