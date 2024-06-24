import LoadingSpinner from "@/components/shared/LoadingSpinner";
import RightSidebar from "@/components/shared/RightSidebar";
import Sidebar from "@/components/shared/Sidebar";
import { getUserbyclerkId, getUserbyId } from "@/lib/actions/user.actions";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await currentUser();
  const userId = userData?.id;
  if (!userId)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  const user = await getUserbyclerkId(userId);

  return (
    <div className="flex">
      <Sidebar user={user} />
      <div className="flex-grow">{children}</div>
      <RightSidebar userId={user._id} />
    </div>
  );
}
