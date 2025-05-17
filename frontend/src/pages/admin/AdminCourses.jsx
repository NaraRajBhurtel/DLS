import React, { useState } from "react";
import { toast } from "sonner";
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
  useGetCourseEnrolledStudentsQuery,
} from "../../../features/api/adminApi";

const AdminCourses = () => {
  const { data: courses, isLoading, error, refetch } = useGetCoursesQuery();
  const [deleteCourse] = useDeleteCourseMutation();

  const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState(null);

  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [selectedCourseForStudents, setSelectedCourseForStudents] =
    useState(null);

  const {
    data: enrolledStudents,
    refetch: refetchStudents,
    isFetching: isFetchingStudents,
  } = useGetCourseEnrolledStudentsQuery(selectedCourseForStudents, {
    skip: !selectedCourseForStudents,
  });

  const promptDeleteCourse = (courseId) => {
    setConfirmDeleteCourseId(courseId);
  };

  const cancelDelete = () => {
    setConfirmDeleteCourseId(null);
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(confirmDeleteCourseId).unwrap();
      toast.success("Course deleted successfully");
      refetch();
      setConfirmDeleteCourseId(null);
    } catch {
      toast.error("Failed to delete course");
      setConfirmDeleteCourseId(null);
    }
  };

  const toggleStudents = (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      setSelectedCourseForStudents(null);
    } else {
      setExpandedCourseId(courseId);
      setSelectedCourseForStudents(courseId);
      refetchStudents();
    }
  };

  if (isLoading) return <p>Loading courses...</p>;
  if (error) return <p>Failed to load courses.</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>
      <table className="w-full border-collapse border border-gray-300">
       <thead>
  <tr className="bg-gray-100">
    <th className="border p-2">Title</th>
    <th className="border p-2">Category</th>
    <th className="border p-2">Created</th>
    <th className="border p-2">Status</th> {/* New status column */}
    <th className="border p-2">Actions</th>
  </tr>
</thead>
        <tbody>
          {courses?.map((course) => (
            <React.Fragment key={course._id}>
              <tr className="hover:bg-gray-50">
                <td
                  onClick={() => toggleStudents(course._id)}
                  className="cursor-pointer border p-2 text-black bg-gray-100 hover:bg-gray-200 font-medium underline transition-colors duration-150"
                >
                  {course.courseTitle || "Untitled"}
                </td>
                

                <td className="border p-2">{course.category}</td>
                <td className="border p-2">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
                   <td className="border p-2">
          {/* Show the course status with basic styling */}
          <span
            className={
              course.isPublished === true
                ? "text-green-600 font-semibold"
                : course.isPublished === false
                ? "text-red-600 font-semibold"
                : "text-gray-600 font-semibold"
            }
          >
            {course.isPublished ? "Published" : "Unpublished"}
          </span>
        </td>
                <td className="border p-2">
                  <button
                    onClick={() => promptDeleteCourse(course._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>

              {expandedCourseId === course._id && (
                <tr>
                  <td colSpan="4" className="p-4 bg-gray-50 border-t">
                    <h4 className="font-semibold mb-2">Enrolled Students:</h4>
                    {isFetchingStudents ? (
                      <p>Loading students...</p>
                    ) : enrolledStudents?.enrolledStudents?.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {enrolledStudents.enrolledStudents.map((student) => (
                          <li key={student._id}>
                            {student.name} ({student.email})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No students enrolled in this course.</p>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {courses?.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete confirmation popup */}
      {confirmDeleteCourseId && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this course?</p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
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

export default AdminCourses;
