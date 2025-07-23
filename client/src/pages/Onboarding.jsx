import onboard from "../assets/onboarding.png";
import { Link } from "react-router-dom";

function Onboarding() {
  return (
    <div className="bg-white">
      <div className="flex flex-col md:flex-row items-center md:h-screen">
        <div className="w-full md:w-1/2">
          <img
            src={onboard}
            alt="onboard"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center text-center px-6 md:px-16">
          <h1 className="font-black text-4xl mt-6 md:mt-0 mb-7">
            Welcome to Labs
          </h1>

          <p className="font-semibold mb-3">
            From patient registration to test results, our platform helps you
            manage every part of your lab workflow with speed, accuracy, and
            peace of mind.
          </p>
          <p className="font-semibold mb-6">
            Focus on diagnostics, we'll handle the rest.
          </p>
          <div className="w-full flex flex-col items-center space-y-3 md:flex-row md:justify-center md:space-y-0 md:space-x-4 mt-7">
            <button className="font-semibold bg-[#0030f1] border border-[#0030f1] text-white rounded w-4/5 md:w-56 cursor-pointer py-3 transition-all duration-200 hover:brightness-110 hover:scale-105 hover:bg-white hover:text-[#0030f1]">
              <Link to="/signup">Create an Account</Link>
            </button>
            <button className="font-semibold border border-[#0030f1] text-[#0030f1] rounded w-4/5 md:w-56 cursor-pointer py-3 transition-all duration-200 hover:bg-[#0030f1] hover:text-white hover:scale-105">
              <Link to="/login">Already have an Account</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
