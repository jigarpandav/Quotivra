import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="loader-container">
      <FaSpinner className="loader-icon" />
      <p>Loading...</p>
    </div>
  );
};

export default Loader;