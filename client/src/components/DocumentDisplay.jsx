import React, { useRef } from "react";
import { Plus } from "lucide-react";

export default function DocumentDisplay() {
  const documents = [
    { name: "Biopsy Report", date: "May 14, 2025" },
    { name: "Blood Test", date: "June 03, 2025" },
    { name: "X-ray Scan", date: "June 15, 2025" },
    // { name: "MRI Results", date: "July 01, 2025" },
  ];

  const fileInputRef = useRef(null);

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("PDF selected:", file?.name);
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center md:px-4 py-10 md:w-1/2">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6">
        <h1 className=" text-gray-800 mb-6">List of documents</h1>
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          onClick={handleBoxClick}
          className="border-2 border-dashed border-gray-300 rounded-xl p-2 items-center flex justify-center cursor-pointer mb-8"
        >
          <Plus className="text-[#0030f1]" size={18} />
          <span className="text-[#0030f1] font-medium"> Add a Document</span>
        </div>

        <div className="relative mb-4">
          <div className="flex justify-between text-xs text-gray-400 font-medium z-10 relative">
            <span>Name</span>
            <span>Past 2 months</span>
          </div>
        </div>

        <ul className="space-y-3 text-sm text-gray-700">
          {documents.map((doc, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span className="text-gray-600">{doc.name}</span>
              <span className="text-gray-400 text-xs">{doc.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
