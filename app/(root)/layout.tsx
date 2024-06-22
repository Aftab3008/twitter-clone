import RightSidebar from "@/components/shared/RightSidebar";
import Sidebar from "@/components/shared/Sidebar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow">{children}</div>
      <RightSidebar />
    </div>
  );
}
