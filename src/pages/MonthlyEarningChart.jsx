import { data } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

console.log("Chart data:", data);

export default function MonthlyEarningsChart({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Monthly Earnings</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="amount" stroke="#22c55e" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
