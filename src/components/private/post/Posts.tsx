import IndividualPost from "./IndividualPost";
import Suggestions from "./Suggestions";

const Posts = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex flex-col gap-5 lg:w-4/5">
        <IndividualPost />
        <IndividualPost />
      </div>
      <Suggestions />
    </div>
  );
};

export default Posts;
