import React from "react";
import { useGetDashboardStatsQuery } from "../../../features/api/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users, BookOpen, IndianRupee, Video } from "lucide-react";

const AdminDashboard = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        Failed to load dashboard data
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      label: "Total Users",
      value: data?.totalUsers || 0,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      bg: "from-blue-100 to-blue-200",
    },
    {
      label: "Total Courses",
      value: data?.totalCourses || 0,
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      bg: "from-green-100 to-green-200",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(data?.totalRevenue || 0),
      icon: <IndianRupee className="h-6 w-6 text-yellow-500" />,
      bg: "from-yellow-100 to-yellow-200",
    },
    {
      label: "Live Meetings",
      value: data?.totalMeetings || 0,
      icon: <Video className="h-6 w-6 text-purple-500" />,
      bg: "from-purple-100 to-purple-200",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`bg-gradient-to-br ${stat.bg} rounded-2xl shadow-md transition transform hover:scale-[1.02] hover:shadow-lg`}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="mb-2">{stat.icon}</div>
              <h3 className="text-md font-medium text-gray-700">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
