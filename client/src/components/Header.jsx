import mobile from "../assets/mobile.jpg";
import { getUser } from "../utils/auth";

export default function Header() {
  const user = getUser();
  const name = user?.name || "Guest";

  return (
    <div className="relative w-full h-64">
      <img src={mobile} alt="mobile" className="w-full h-full object-cover" />
      <div className="absolute bottom-5 left-6 text-white drop-shadow-md">
        <h1 className="text-3xl font-bold">Hello {name}</h1>
        <p className="text-base">Welcome To Labs</p>
      </div>
    </div>
  );
}
