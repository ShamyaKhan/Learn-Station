import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { BACKEND_URL } from "../../utils/constants";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const isCourseListPage = location.pathname.includes("/course-list");
  const { navigate, isEducator, setIsEducator, getToken } =
    useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      } else {
        const token = await getToken();
        const { data } = await axios.get(
          `${BACKEND_URL}/api/educator/update-role`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (data.success) {
          setIsEducator(true);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b 
                border-gray-500 py-4 ${isCourseListPage ? "bg-white" : "bg-cyan-100/70"}`}
    >
      <h2
        onClick={() => navigate("/")}
        className="w-32 lg:w-36 border text-center cursor-pointer rounded-lg text-xl"
      >
        Learn Station
      </h2>
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={() => becomeEducator()}>
                {isEducator ? "Educator Dashboard" : "Become an Educator"}
              </button>
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>

        {user ? (
          <UserButton />
        ) : (
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
            onClick={() => openSignIn()}
          >
            Create Account
          </button>
        )}
      </div>

      {/* for smaller screens */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button onClick={() => becomeEducator()}>
                {isEducator ? "Educator Dashboard" : "Become an Educator"}
              </button>
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>

        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
