import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import department from "../assets/department.png";
import patient from "../assets/patient.png";
import section from "../assets/sections.png";
import test from "../assets/test.png";
import upload from "../assets/upload.png";

const cards = [
  { title: "Create Department", icon: department, route: "/departments" },
  { title: "Create Sections", icon: section, route: "/sections" },
  { title: "Add a Patient", icon: patient, route: "/patients" },
  { title: "New Lab Request", icon: test, route: "/lab-request" },
  { title: "Upload Test Results", icon: upload, route: "/upload-results" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="font-extrabold text-2xl mb-4">How can we help you?</h1>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-2 px-2 pb-4">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route)}
            className="cursor-pointer flex-shrink-0 w-48 h-36 bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col items-center justify-between transition hover:shadow-lg"
          >
            <div className="w-full flex items-center justify-between">
              <img src={card.icon} alt={card.title} className="w-12 h-12" />
              <ChevronRight className="text-[#0030f1]" />
            </div>
            <p className="text-[#0030f1] font-semibold text-sm text-center mt-3">
              {card.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
