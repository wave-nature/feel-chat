import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = () => {
  return <Skeleton count={7} height={70} />;
};

export default SkeletonLoader;
