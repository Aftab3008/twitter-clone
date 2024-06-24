import Link from "next/link";
import RightPanelSkeleton from "./skeletons/RightPanelSkeleton";
import { Button } from "../ui/button";
import { getUserSuggetions } from "@/lib/actions/user.actions";
import { Usertypes } from "@/types";

const RightSidebar = async ({ userId }: { userId: string }) => {
  const userSuggetions = await getUserSuggetions(userId);
  if (!userSuggetions) {
    return (
      <>
        <RightPanelSkeleton />
        <RightPanelSkeleton />
        <RightPanelSkeleton />
        <RightPanelSkeleton />
      </>
    );
  }
  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 sticky top-2 rounded-lg">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {userSuggetions?.map((user: Usertypes) => (
            <Link
              href={`/profile/${user.username}`}
              className="flex items-center justify-between gap-4"
              key={user._id}
            >
              <div className="flex gap-2 items-center">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={user.imgUrl || "/avatar-placeholder.png"} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold tracking-tight truncate w-28">
                    {user.fullName}
                  </span>
                  <span className="text-sm text-slate-500">
                    @{user.username}
                  </span>
                </div>
              </div>
              <div>
                <Button className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm">
                  Follow
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default RightSidebar;
