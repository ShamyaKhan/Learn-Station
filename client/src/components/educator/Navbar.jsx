import { assets, dummyEducatorData } from "../../assets/assets";
import { useUser, UserButton } from "@clerk/react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useUser();
  const educatorData = dummyEducatorData;

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/">
        <h2 className="w-32 lg:w-36 border bg-blue-100 text-center cursor-pointer rounded-lg text-xl">
          Learn Station
        </h2>
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi {user ? user.fullName : "Developer"}</p>
        {user ? <UserButton /> : <img src={assets.profile_img} />}
      </div>
    </div>
  );
};

export default Navbar;
