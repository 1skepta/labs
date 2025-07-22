import onboard from "../assets/onboarding.png";
import { Link } from "react-router-dom";
function Onboarding() {
  return (
    <div className="bg-[#ffffff]">
      <div className="w-full">
        <img src={onboard} alt="onboard" className="w-full" />
      </div>
      <div className="text-center flex flex-col items-center">
        <h1 className="font-black text-4xl mt-4 mb-7">Welcome to Labs</h1>

        <p className="font-semibold mx-12 text-center">
          From patient registration to test results, our platform helps you
          manage every part of your lab workflow with speed, accuracy, and peace
          of mind.
        </p>
        <p className="font-semibold mx-12 text-center mt-3">
          Focus on diagnostics, we'll handle the rest.
        </p>

        <button className="font-semibold bg-[#0030f1] text-white rounded w-4/5 cursor-pointer py-3 mb-2 mt-7">
          <Link to="/signup"> Create an Account</Link>
        </button>
        <button className="font-semibold rounded border w-4/5 cursor-pointer py-3">
          <Link to="/login"> Already have an Account</Link>
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
