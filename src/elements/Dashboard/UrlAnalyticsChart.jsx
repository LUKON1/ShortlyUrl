import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from '../../utils/useAxiosPrivate';
import dayjs from 'dayjs';

const UrlAnalyticsChart = ({ urlId }) => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosPrivate.get(`/myurls/analytics/${urlId}`);
        setChartData(response.data.chartData);
      } catch (err) {
        setError(t('myurls.analyticsError'));
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (urlId) {
      fetchAnalytics();
    }
  }, [urlId, axiosPrivate, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 text-xl text-blue-600 dark:text-blue-400">
        {t('myurls.loadingAnalytics')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-4 text-xl text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <h3 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
        {t('myurls.analytics')}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
          <XAxis dataKey="date" className="fill-gray-700 dark:fill-gray-300" />
          <YAxis className="fill-gray-700 dark:fill-gray-300" />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgb(30 41 59)', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} name={t('myurls.clicks')} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UrlAnalyticsChart;
