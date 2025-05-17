import React, { useState } from "react";
import { toast } from "sonner"; // Adjust import path as needed
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  usePromoteToInstructorMutation,
} from "../../../features/api/adminApi";

const AdminUsers = () => {
  const { data: users, error, isLoading, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [promoteToInstructor, { isLoading: isPromoting }] =
    usePromoteToInstructorMutation();

  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);

  const handleDeleteConfirmed = async () => {
    try {
      await deleteUser(confirmDeleteUserId).unwrap();
      toast.success("User deleted successfully.");
      refetch();
    } catch (err) {
      toast.error("Failed to delete the user.");
    } finally {
      setConfirmDeleteUserId(null);
    }
  };

  const handlePromote = async (userId) => {
    if (window.confirm("Promote this user to instructor?")) {
      try {
        await promoteToInstructor(userId).unwrap();
        toast.success("User has been promoted to instructor.");
        refetch();
      } catch (err) {
        toast.error("Failed to promote the user.");
      }
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Joined</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{user.name}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2 capitalize">
                {user.role}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2 space-x-2">
                {user.role !== "instructor" && (
                  <button
                    onClick={() => handlePromote(user._id)}
                    disabled={isPromoting}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Promote
                  </button>
                )}
                <button
                  onClick={() => setConfirmDeleteUserId(user._id)}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users?.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirm Delete Modal */}
      {confirmDeleteUserId && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteUserId(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-500 bg-opacity-70 text-white hover:bg-red-600 hover:bg-opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
