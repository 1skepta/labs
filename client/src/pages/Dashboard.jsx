import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import department from "../assets/department.png";
import patient from "../assets/patient.png";
import section from "../assets/sections.png";
import test from "../assets/test.png";
import upload from "../assets/upload.png";
import labs from "../assets/labs.png";
import LabTestDisplay from "../components/LabTestDisplay";
import PatientDisplay from "../components/PatientDisplay";
import DocumentDisplay from "../components/DocumentDisplay";
import LabTestChart from "../components/LabTestChart";

const cards = [
  { title: "Create Department", icon: department, route: "/departments" },
  { title: "Create Sections", icon: section, route: "/sections" },
  { title: "Lab Test Setup", icon: labs, route: "/lab-tests" },
  { title: "Add a Patient", icon: patient, route: "/patients" },
  { title: "New Lab Request", icon: test, route: "/requests" },
  { title: "Upload Test Results", icon: upload, route: "/upload-results" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-screen-lg mx-auto relative">
      <h1 className="font-extrabold text-2xl mb-4">How can we help you?</h1>

      <div className="relative">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide -mx-2 px-2 pb-4">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.route)}
              className="cursor-pointer flex-shrink-0 w-52 h-36 bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col items-center justify-between transition hover:shadow-lg"
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

        <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent" />
      </div>

      <div className="md:flex md:items-center">
        <LabTestChart /> <LabTestDisplay />
      </div>
      <div className="md:flex">
        <PatientDisplay />
        <DocumentDisplay />
      </div>
    </div>
  );
}
