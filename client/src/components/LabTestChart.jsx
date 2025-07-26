import { useEffect, useState } from "react";
import API from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function LabTestChart() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await API.get("/lab-tests");
        setTests(res.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load lab tests", err);
      }
    };

    fetchTests();
  }, []);

  const chartData = tests.map((test) => ({
    name: test.name,
    cost: parseFloat(test.cost),
  }));

  const baseColor = "#0030f1";
  const colorVariations = [
    "#0030f1",
    "#334ef3",
    "#4d65f4",
    "#667bf6",
    "#8092f7",
    "#99a8f9",
  ];

  return (
    <div className="p-4 md:w-1/2">
      <h2 className="mb-4 text-gray-800">Chart of Lab Tests</h2>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorVariations[index % colorVariations.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
