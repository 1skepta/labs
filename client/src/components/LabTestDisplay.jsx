import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  FlaskConical,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const cardData = [
  {
    key: "patients",
    title: "Patients",
    icon: Users,
    endpoint: "/patients",
    bgColor: "#e6ebff",
    iconColor: "#0030f1",
    route: "/patients",
  },
  {
    key: "reports",
    title: "Lab Reports",
    icon: FileText,
    endpoint: null,
    bgColor: "#e6f0ff",
    iconColor: "#3fa9f5",
    route: null,
  },
  {
    key: "tests",
    title: "Lab Tests",
    icon: FlaskConical,
    endpoint: "/lab-tests",
    bgColor: "#e5fbe6",
    iconColor: "#7ed957",
    route: "/lab-tests",
  },
  {
    key: "requests",
    title: "Lab Requests",
    icon: ClipboardList,
    endpoint: "/lab-requests",
    bgColor: "#fff4e5",
    iconColor: "#ffae42",
    route: "/requests",
  },
];

export default function LabTestDisplay() {
  const [counts, setCounts] = useState({
    patients: 0,
    reports: 3,
    tests: 0,
    requests: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      for (let card of cardData) {
        if (!card.endpoint) continue;
        try {
          const res = await API.get(card.endpoint);
          const count = Array.isArray(res.data)
            ? res.data.length
            : res.data?.count || 0;
          setCounts((prev) => ({
            ...prev,
            [card.key]: count,
          }));
        } catch (err) {
          console.error(`Error loading ${card.title}`, err);
        }
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {cardData.map(({ key, title, icon: Icon, bgColor, iconColor, route }) => (
        <div
          key={key}
          onClick={() => route && navigate(route)}
          className={`rounded-xl p-5 shadow-md flex flex-col justify-between ${
            route
              ? "cursor-pointer hover:brightness-95 transition"
              : "cursor-default"
          }`}
          style={{ backgroundColor: bgColor }}
          role={route ? "button" : undefined}
          tabIndex={route ? 0 : undefined}
          onKeyDown={(e) => {
            if (route && (e.key === "Enter" || e.key === " ")) {
              navigate(route);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <Icon size={24} color={iconColor} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">{counts[key]}</p>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              Last 7 days <TrendingUp size={16} className="inline" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
