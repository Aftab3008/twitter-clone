const LoadingSpinner = ({
  size = "md",
}: {
  size?: "md" | "lg" | "xs" | "sm" | "xl";
}) => {
  const sizeClass = `loading-${size}`;

  return <span className={`loading loading-dots ${sizeClass} bg-blue-1`} />;
};
export default LoadingSpinner;
