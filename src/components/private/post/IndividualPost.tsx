import { BiLike, BiDislike } from "react-icons/bi";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";

const IndividualPost = () => {
  return (
    <div className="flex flex-col gap-5 shadow p-5 rounded bg-slate-100">
      <div className="flex gap-2 items-center">
        <img src="/profile.png" alt="profile" width="40" className="max-h-[40px]" />
        <span className="underline underline-offset-2 text-slate-500 text-sm border-r-2 border-slate-500 pr-2">
          Name
        </span>
        <span className="text-sm text-slate-500 italic">2 days ago</span>
      </div>
      <h2 className="text-2xl">This is the heading of a post. You can write it as long as possible</h2>
      <div>
        This is the description of your post. Here are some random words. Lorem, ipsum dolor sit amet consectetur
        adipisicing elit. Molestias corporis nostrum quae eius, excepturi illo sunt a, expedita incidunt laboriosam iste
        modi officia voluptatibus autem asperiores. Molestias magni obcaecati blanditiis?
      </div>
      <div className="flex flex-wrap gap-5">
        <img src="/register-img.png" className="max-h-40 w-auto" />
        <img src="/login-img.webp" className="max-h-40 w-auto" />
        <img src="/register-img.png" className="max-h-40 w-auto" />
        <img src="/login-img.webp" className="max-h-40 w-auto" />
      </div>
      <div className="flex gap-2">
        <div className="flex gap-1 items-center">
          <BiLike />
          <span>1</span>
        </div>
        <div className="flex gap-1 items-center">
          <BiDislike />
          <span>1</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3>Comments : </h3>
        <div className="flex gap-2">
          <img src="/profile.png" alt="profile" width="40" className="max-h-[40px]" />
          <div className="flex flex-col">
            <p>This is a comment of somebody</p>
            <span className="text-sm text-slate-500 italic">1 day ago</span>
          </div>
        </div>
        <div className="flex gap-2">
          <img src="/profile.png" alt="profile" width="40" className="max-h-[40px]" />
          <div className="flex flex-col">
            <p>This is another comment of somebody. This one is a bit long</p>
            <span className="text-sm text-slate-500 italic">5 hours ago</span>
          </div>
        </div>
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
export default IndividualPost;
