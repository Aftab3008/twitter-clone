import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
