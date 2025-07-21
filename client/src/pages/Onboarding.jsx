import onboard from "../assets/onboarding.png";
import { Link } from "react-router-dom";
function Onboarding() {
  return (
    <div>
      <div className="w-full">
        <img src={onboard} alt="onboard" className="w-full" />
      </div>
      <div className="text-center flex flex-col items-center">
        <h1 className="font-black text-4xl my-4">Welcome to Labs</h1>

        <button className="bg-[#0030f1] text-white rounded w-4/5 cursor-pointer py-3 mb-4">
          <Link to="/signup"> Create an Account</Link>
        </button>
        <button className="rounded border w-4/5 cursor-pointer py-3">
          <Link to="/login"> Already have an Account</Link>
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
