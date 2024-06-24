import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import XSvg from "./XSvg";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import LoadingSpinner from "./LoadingSpinner";
import { Usertypes } from "@/types";

const Sidebar = ({ user }: { user: Usertypes }) => {
  return (
    <div className="md:flex-[2_2_0] w-1/5 max-w-md md:min-w-[200px] overflow-hidden">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-3/4 overflow-auto">
        <Link href="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4 w-full">
          <li>
            <Link
              href="/"
              className="flex flex-wrap gap-3 items-center justify-center md:justify-start hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 w-full cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/notifications"
              className="flex gap-3 items-center justify-center md:justify-start hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 w-full cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden sm:inline-block">
                Notifications
              </span>{" "}
              {/* Adjusted for visibility */}
            </Link>
          </li>
          <li>
            <Link
              href={`/profile/${user?.username}`}
              className="flex gap-3 items-center justify-center md:justify-start hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 w-full cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden sm:inline-block">
                Profile
              </span>{" "}
              {/* Adjusted for visibility */}
            </Link>
          </li>
        </ul>

        {user ? (
          <div className="mt-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-3 px-2 overflow-hidden">
            <Link
              href={`/profile/${user.username}`}
              className="flex gap-2 items-center transition-all duration-300 hover:bg-[#181818] py-3 px-3 rounded-full flex-1 overflow-hidden"
            >
              <div className="avatar hidden md:inline-flex overflow-hidden">
                <div className="w-10 rounded-full">
                  <img
                    src={user?.imgUrl || "/avatar-placeholder.png"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center flex-1">
                <div className="hidden md:flex flex-col">
                  <p className="text-white font-bold text-sm w-full truncate">
                    {user?.fullName}
                  </p>
                  <p className="text-slate-500 text-sm">@{user?.username}</p>
                </div>
              </div>
            </Link>
            <div className="flex justify-center items-center cursor-pointer">
              <SignOutButton redirectUrl="/sign-in">
                <BiLogOut size="24" className="text-white" />
              </SignOutButton>
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};
export default Sidebar;
