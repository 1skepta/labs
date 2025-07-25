import { useEffect, useRef, useState } from "react";
import mobile from "../assets/mobile.jpg";
import desktop from "../assets/desktop.jpg";
import { getUser } from "../utils/auth";
import { Bell, UserCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const user = getUser();
  const name = user?.name || "Guest";
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="absolute bottom-5 left-6 md:left-16 lg:left-24 right-6 flex justify-between items-center w-[calc(100%-3rem)] md:w-[calc(100%-8rem)] lg:w-[calc(100%-12rem)] text-white drop-shadow-md">
        <div>
          <h1 className="text-3xl font-bold">Hello {name}</h1>
          <p className="text-base">Welcome To Labs</p>
        </div>

        <div className="flex items-center space-x-6 relative">
          <div className="flex items-center space-x-1 cursor-pointer">
            <Bell className="w-6 h-6" />
            <span className="hidden md:inline text-sm">Notifications</span>
          </div>

          <div
            className="flex items-center space-x-1 cursor-pointer relative"
            onClick={() => setOpen(!open)}
          >
            <UserCircle className="w-8 h-8" />
            <span className="hidden md:inline text-sm">Account</span>

            {open && (
              <div
                ref={modalRef}
                className="absolute top-full mt-2 right-0 bg-white text-black p-3 rounded shadow-md z-[1000000000] w-40"
              >
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                  <LogOut className="w-4 h-4" />
                  <Link to="/">Log out</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
