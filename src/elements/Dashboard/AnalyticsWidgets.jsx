import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// A more refined color palette fitting the "sky/blue" theme but diverse enough
const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#6366f1", // indigo-500
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{payload[0].name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{payload[0].value} clicks</p>
      </div>
    );
  }
  return null;
};

const PieChartWidget = ({ data, title }) => {
  const hasData = data && Object.keys(data).length > 0;

  const chartData = hasData
    ? Object.keys(data)
        .map((key) => ({ name: key, value: data[key] }))
        .sort((a, b) => b.value - a.value)
    : [{ name: "No Data", value: 1 }];

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-2 text-center text-lg font-bold text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <div className="min-h-62.5 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hasData ? COLORS[index % COLORS.length] : "#e5e7eb"}
                  className="outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {hasData && (
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ListWidget = ({ data, title }) => {
  const hasData = data && Object.keys(data).length > 0;

  const sortedData = hasData
    ? Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8) // Top 8 items
    : [];

  const maxVal = sortedData.length > 0 ? sortedData[0][1] : 1;

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-center text-lg font-bold text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {!hasData ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            No Data Available
          </div>
        ) : (
          sortedData.map(([key, value], index) => {
            const percentage = Math.round((value / maxVal) * 100);
            return (
              <div key={key} className="relative">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="truncate font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}. {key}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{value}</span>
                </div>
                {/* Progress bar background */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const AnalyticsWidgets = ({ devices = {}, browsers = {}, countries = {}, referrers = {}, t }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <PieChartWidget data={devices} title={t("analytics.devices") || "Devices"} />
      <PieChartWidget data={browsers} title={t("analytics.browsers") || "Browsers"} />
      <ListWidget data={countries} title={t("analytics.countries") || "Countries"} />
      <ListWidget data={referrers} title={t("analytics.referrers") || "Referrers"} />
    </div>
  );
};

export default AnalyticsWidgets;
