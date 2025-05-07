import React from "react";
import { useGetAllDiscussionsQuery } from "../../../features/api/discussionApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DiscussionPage = () => {
  const { data: discussions, isLoading, isError } = useGetAllDiscussionsQuery();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Hook for navigating to homepage

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError) return <p className="text-center mt-10">Failed to load discussions.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discussion Forum</h1>

        {/* Back Button on the Right Side */}
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => navigate("/")} // Navigate to homepage
        >
          Back to Homepage
        </Button>
      </div>

      {/* Container for Discussions */}
      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow-lg mb-6 h-96 overflow-y-auto">
        {discussions.map((d) => (
          <Link to={`/discussion/${d._id}`} key={d._id}>
            <div className="border rounded-xl p-4 bg-white dark:bg-[#0f172a] shadow-sm hover:shadow-md transition mb-4">
              <h2 className="text-xl font-semibold">{d.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mt-2">
                {d.description}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Created by: {d.createdBy?.name || "Unknown"} on{" "}
                {new Date(d.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Create Discussion Button (for instructors only) */}
      {user?.role === "instructor" && (
        <Link to="/discussion/new">
          <Button variant="default" className="mb-6">
            Create Discussion
          </Button>
        </Link>
      )}
    </div>
  );
};

export default DiscussionPage;
