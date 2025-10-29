import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ProfileAnalyticsChart({ data, title }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            className="dark:stroke-gray-400"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis
            stroke="#6b7280"
            className="dark:stroke-gray-400"
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#374151' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="created"
            stroke="#0ea5e9"
            strokeWidth={2}
            name="URLs Created"
            dot={{ fill: '#0ea5e9', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#f43f5e"
            strokeWidth={2}
            name="Clicks"
            dot={{ fill: '#f43f5e', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProfileAnalyticsChart;
