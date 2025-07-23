import mobile from "../assets/mobile.jpg";
import desktop from "../assets/desktop.jpg";
import { getUser } from "../utils/auth";

export default function Header() {
  const user = getUser();
  const name = user?.name || "Guest";

  return (
    <div className="relative w-full h-64">
      <img
        src={mobile}
        alt="mobile"
        className="w-full h-full object-cover block md:hidden"
      />

      <img
        src={desktop}
        alt="desktop"
        className="w-full h-full object-cover hidden md:block"
      />

      <div className="absolute bottom-5 left-6 md:left-16 lg:left-24 text-white drop-shadow-md">
        <h1 className="text-3xl font-bold">Hello {name}</h1>
        <p className="text-base">Welcome To Labs</p>
      </div>
    </div>
  );
}
