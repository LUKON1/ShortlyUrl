function StatsCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          {trend && (
            <div
              className={`mt-2 inline-flex items-center gap-1 text-sm font-medium ${
                trend.direction === "up"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <span>{trend.direction === "up" ? "↑" : "↓"}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-sky-400 to-blue-500 text-white dark:from-sky-500 dark:to-blue-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
