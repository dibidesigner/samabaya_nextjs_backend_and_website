const RingLoader = ({ size = 12, color = "border-blue-700" }) => {
  return (
    <div
      className={`animate-spin rounded-full 
      border-4 border-gray-200 ${color}`}
      style={{
        width: `${size * 4}px`,
        height: `${size * 4}px`,
        borderTopColor: "transparent",
      }}
    />
  );
};

export default RingLoader;
