const FollowButton = () => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Follow button clicked");
  };

  return (
    <button
      className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
      onClick={handleClick}
    >
      Follow
    </button>
  );
};

export default FollowButton;
