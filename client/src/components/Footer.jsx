import { LucideArrowUp, Copyright, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="flex items-center justify-between py-7 px-6 md:px-20"
      style={{ borderTop: "0.5px solid rgba(113, 113, 122, 0.2)" }}
    >
      <div className="flex items-center select-none cursor-default">
        <Copyright size={13} />
        <span className="text-sm ml-3">{currentYear} | labs</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={scrollToTop}
          className="bg-gray-200 p-2 rounded-full cursor-pointer hover:bg-gray-300 transition"
        >
          <LucideArrowUp size={16} className="text-gray-700" />
        </button>
        <div className="relative group">
          <Link
            to="/"
            className="bg-gray-200 p-2 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
          >
            <LogOut size={16} className="text-gray-700" />
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-600">
            LogOut
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
