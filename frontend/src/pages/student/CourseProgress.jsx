import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from "../../../features/api/courseProgressApi";
import { toast } from "sonner";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

    const[updateLectureProgress ] = useUpdateLectureProgressMutation();
    const [
        completeCourse,
        { data: markCompleteData, isSuccess: completedSuccess },
      ] = useCompleteCourseMutation();
      const [
        inCompleteCourse,
        { data: markInCompleteData, isSuccess: inCompletedSuccess },
      ] = useInCompleteCourseMutation();

      useEffect(() => {
        console.log(markCompleteData);
    
        if (completedSuccess) {
          refetch();
          toast.success(markCompleteData.message);
        }
        if (inCompletedSuccess) {
          refetch();
          toast.success(markInCompleteData.message);
        }
      }, [completedSuccess, inCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1> "Failed to get course Detail"</h1>;

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle, matUrl } = courseDetails;


  const initialLecture =currentLecture || (courseDetails?.lectures && courseDetails?.lectures[0]);

    const isLectureCompleted = (lectureId) => {
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
      };

      const handleLectureProgress = async (lectureId) => {
          await updateLectureProgress({ courseId, lectureId });
          refetch();
        };
        
        const handleSelectLecture = (lecture) => {
          setCurrentLecture(lecture);
          handleLectureProgress(lecture._id);
        };
      // Handle select a specific lecture to watch
    const handleCompleteCourse = async () => {
        await completeCourse(courseId);
      };
      const handleInCompleteCourse = async () => {
        await inCompleteCourse(courseId);
      };

  console.log(data);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Course Name */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>{" "}
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Side - Video and Lecture Title */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-md p-6 border border-gray-300 bg-white">
          <video
            src={currentLecture?.videoUrl || initialLecture?.videoUrl}
            controls
            className="w-full h-auto md:rounded-lg"
            onPlay={() =>
              handleLectureProgress(currentLecture?._id || initialLecture._id)
            }
          />
          <div className="mb-6"></div>

          {/* Display Current Lecture Title */}
          <div className="mt-4">
            <h3 className="font-medium text-lg mb-2">
              {`Lecture ${
                courseDetails.lectures.findIndex(
                  (lec) =>
                    lec._id === (currentLecture?._id || initialLecture._id)
                ) + 1
              } : ${
                currentLecture?.lectureTitle || initialLecture.lectureTitle
              }`}
            </h3>
          </div>

          <div className="mt-4">
  <Button
    className="w-full py-2 px-4 rounded-lg border border-gray-300 hover:shadow-md transition-all"
    onClick={() => {
      const materialUrl = currentLecture?.materialUrl || initialLecture?.materialUrl;

      if (materialUrl) {
        // Open the material URL in a new tab
        window.open(materialUrl, "_blank");
      } else {
        toast.error("Material URL not available for this lecture");
      }
    }}
  >
    View Material (PDF)
  </Button>
</div>

        </div>

        {/* Right Side - Course Lecture List */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture, idx) => (
              <Card
              key={lecture._id}
              className={`mb-3 hover:cursor-pointer transition transform ${
                lecture._id === currentLecture?._id
                  ? "bg-gray-200 dark:dark:bg-gray-800"
                  : ""
              } `}
              onClick={() => handleSelectLecture(lecture)}
            >
                <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
