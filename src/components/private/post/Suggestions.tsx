import { useState } from "react";
import Input from "../../../ui/Input";
import Spinner from "../../../ui/Spinner";
import { getUsersByQuery } from "../../../firebase/db/userDBFunctions";
import { createdDBUserType } from "../../../utils/types";
import { Link } from "react-router-dom";

const Suggestions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<createdDBUserType[] | []>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.target as typeof e.target & { value: string };
    setSearchTerm(value);
    setLoading(true);
    const usersData = await getUsersByQuery(value.toLowerCase());
    setUsers(usersData);
    setLoading(false);
  };

  return (
    <div className="pl-5 flex-1 flex flex-col gap-5">
      <div>Search Users by Email</div>
      <Input type="text" placeholder="Search" value={searchTerm} onChange={handleChange} />
      {loading ? (
        <Spinner size="md" />
      ) : (
        searchTerm.trim() === "" &&
        users.length === 0 && (
          <span className="flex justify-center italic text-slate-400">Search Users by email to follow</span>
        )
      )}
      {!loading && searchTerm.length > 0 && users.length === 0 && (
        <span className="flex justify-center italic text-slate-400">No User found</span>
      )}
      {users.map((user) => (
        <div key={user.uid} className="flex gap-5 items-center justify-center">
          <img src={user.photoURL} alt="profile" width="40" className="rounded-full max-h-[40px]" />
          <Link to={`/user?id=${user.uid}`} className="underline underline-offset-2">
            {user.displayName}
          </Link>
        </div>
      ))}
    </div>
  );
};
export default Suggestions;
