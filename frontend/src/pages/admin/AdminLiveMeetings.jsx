import React, { useState } from "react";
import {
  useGetAllMeetingsQuery,
  useDeleteMeetingMutation,
} from "../../../features/api/adminApi";
import { toast } from "sonner";

const AdminLiveMeetings = () => {
  const {
    data: meetings,
    isLoading,
    error,
    refetch,
  } = useGetAllMeetingsQuery();
  const [deleteMeeting] = useDeleteMeetingMutation();

  // State for modal visibility and which meeting to delete
  const [showConfirm, setShowConfirm] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const openConfirm = (meetingId) => {
    setMeetingToDelete(meetingId);
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setMeetingToDelete(null);
    setLoadingDelete(false);
  };

  const handleDelete = async () => {
    if (!meetingToDelete) return;
    setLoadingDelete(true);
    try {
      await deleteMeeting(meetingToDelete).unwrap();
      refetch();
      closeConfirm();
      toast.success("Meeting deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete meeting.");
      setLoadingDelete(false);
    }
  };

  if (isLoading) return <p>Loading meetings...</p>;
  if (error) return <p>Failed to load meetings.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Live Meetings</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Course Title</th>
            <th className="border p-2">Instructor</th>
            <th className="border p-2">Scheduled At</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {meetings?.length > 0 ? (
            meetings.map((meeting) => (
              <tr key={meeting._id} className="hover:bg-gray-50">
                <td className="border p-2">
                  {meeting.courseId?.courseTitle || "N/A"}
                </td>
                <td className="border p-2">
                  {meeting.instructorId?.name || "N/A"}
                </td>
                <td className="border p-2">
                  {meeting.startTime
                    ? new Date(meeting.startTime).toLocaleString()
                    : "N/A"}
                </td>
                <td className="border p-2">
                  {meeting.status === "live" ? (
                    <span className="text-green-600 font-semibold">Live</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Scheduled
                    </span>
                  )}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => openConfirm(meeting._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No live meetings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeConfirm} // close modal on clicking outside
        >
          <div
            className="bg-white rounded shadow-lg p-6 w-80"
            onClick={(e) => e.stopPropagation()} // prevent modal close on clicking inside
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this meeting?</p>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={loadingDelete}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={loadingDelete}
              >
                {loadingDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiveMeetings;
