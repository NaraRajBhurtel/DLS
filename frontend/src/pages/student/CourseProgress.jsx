// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "sonner";

// import {
//   useCompleteCourseMutation,
//   useGetCourseProgressQuery,
//   useInCompleteCourseMutation,
//   useUpdateLectureProgressMutation,
//   useGetQuizzesByCourseIdQuery,
// } from "../../../features/api/courseProgressApi";

// const CourseProgress = () => {
//   const { courseId } = useParams();

//   const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
//   const {
//     data: quizzes,
//     isLoading: quizLoading,
//     isError: quizError,
//   } = useGetQuizzesByCourseIdQuery(courseId);

//   const [updateLectureProgress] = useUpdateLectureProgressMutation();
//   const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] =
//     useCompleteCourseMutation();
//   const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] =
//     useInCompleteCourseMutation();

//   const [currentLecture, setCurrentLecture] = useState(null);
//   const [quizModalOpen, setQuizModalOpen] = useState(false);
//   const [activeQuiz, setActiveQuiz] = useState(null);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [score, setScore] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   useEffect(() => {
//     if (completedSuccess) {
//       refetch();
//       toast.success(markCompleteData.message);
//     }
//     if (inCompletedSuccess) {
//       refetch();
//       toast.success(markInCompleteData.message);
//     }
//   }, [completedSuccess, inCompletedSuccess]);

//   if (isLoading) return <h1>Loading course...</h1>;
//   if (isError) return <h1>Failed to get course details</h1>;

//   const { courseDetails, progress, completed } = data.data;
//   const initialLecture = currentLecture || courseDetails?.lectures?.[0];

//   const isLectureCompleted = (lectureId) =>
//     progress.some((prog) => prog.lectureId === lectureId && prog.viewed);

//   const handleLectureProgress = async (lectureId) => {
//     await updateLectureProgress({ courseId, lectureId });
//     refetch();
//   };

//   const handleSelectLecture = (lecture) => {
//     setCurrentLecture(lecture);
//     handleLectureProgress(lecture._id);
//   };

//   const handleCompleteCourse = async () => {
//     await completeCourse(courseId);
//   };

//   const handleInCompleteCourse = async () => {
//     await inCompleteCourse(courseId);
//   };

//   const handleOpenQuiz = (quiz) => {
//     setActiveQuiz(quiz);
//     setUserAnswers({});
//     setScore(null);
//     setCurrentQuestionIndex(0);
//     setQuizModalOpen(true);
//   };

//   const handleAnswerChange = (questionId, option) => {
//     setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
//   };

//   const handleSubmitQuiz = () => {
//     if (!activeQuiz) return;

//     let correct = 0;

//     activeQuiz.questions.forEach((q, index) => {
//       const userAnswer = userAnswers[q._id];
//       const correctAnswer = activeQuiz.correctAnswers[index];

//       if (userAnswer === correctAnswer) correct++;
//     });

//     setScore(`${correct} / ${activeQuiz.questions.length}`);
//   };

//   const currentQuestion = activeQuiz?.questions?.[currentQuestionIndex];

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       {/* Title & Complete */}
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">{courseDetails.courseTitle}</h1>
//         <Button
//           onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
//           variant={completed ? "outline" : "default"}
//         >
//           {completed ? (
//             <div className="flex items-center">
//               <CheckCircle className="h-4 w-4 mr-2" />
//               <span>Completed</span>
//             </div>
//           ) : (
//             "Mark as completed"
//           )}
//         </Button>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Video */}
//         <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-md p-6 border border-gray-300 bg-white">
//           <video
//             src={currentLecture?.videoUrl || initialLecture?.videoUrl}
//             controls
//             className="w-full h-auto md:rounded-lg"
//             onPlay={() =>
//               handleLectureProgress(currentLecture?._id || initialLecture._id)
//             }
//           />
//           <div className="mt-4">
//             <h3 className="font-medium text-lg mb-2">
//               {`Lecture ${
//                 courseDetails.lectures.findIndex(
//                   (lec) => lec._id === (currentLecture?._id || initialLecture._id)
//                 ) + 1
//               }: ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}`}
//             </h3>
//           </div>
//           <div className="mt-4">
//             <Button
//               className="w-full"
//               onClick={() => {
//                 const materialUrl =
//                   currentLecture?.materialUrl || initialLecture?.materialUrl;
//                 if (materialUrl) {
//                   window.open(materialUrl, "_blank");
//                 } else {
//                   toast.error("Material URL not available");
//                 }
//               }}
//             >
//               View Material (PDF)
//             </Button>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4">
//           <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
//           <div className="flex-1 overflow-y-auto">
//             {courseDetails?.lectures.map((lecture) => (
//               <Card
//                 key={lecture._id}
//                 className={`mb-3 hover:cursor-pointer ${
//                   lecture._id === currentLecture?._id ? "bg-gray-200" : ""
//                 }`}
//                 onClick={() => handleSelectLecture(lecture)}
//               >
//                 <CardContent className="flex items-center justify-between p-4">
//                   <div className="flex items-center">
//                     {isLectureCompleted(lecture._id) ? (
//                       <CheckCircle2 size={24} className="text-green-500 mr-2" />
//                     ) : (
//                       <CirclePlay size={24} className="text-gray-500 mr-2" />
//                     )}
//                     <CardTitle className="text-lg font-medium">
//                       {lecture.lectureTitle}
//                     </CardTitle>
//                   </div>
//                   {isLectureCompleted(lecture._id) && (
//                     <Badge variant="outline" className="bg-green-200 text-green-600">
//                       Completed
//                     </Badge>
//                   )}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* QUIZZES */}
//           <h2 className="font-semibold text-xl mt-6 mb-3">Course Quizzes</h2>
//           {quizLoading ? (
//             <p>Loading quizzes...</p>
//           ) : quizError ? (
//             <p className="text-red-500">Failed to load quizzes.</p>
//           ) : quizzes?.length === 0 ? (
//             <p>No quizzes available.</p>
//           ) : (
//             quizzes.map((quiz) => (
//               <Card key={quiz._id} className="mb-3">
//                 <CardContent className="flex items-center justify-between p-4">
//                   <CardTitle className="text-md font-medium">
//                     {quiz.quizTitle}
//                   </CardTitle>
//                   <Button variant="outline" onClick={() => handleOpenQuiz(quiz)}>
//                     Attempt Quiz
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>

//       {/* QUIZ MODAL */}
//             <Dialog open={quizModalOpen} onOpenChange={setQuizModalOpen}>
//   <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
//     <DialogHeader>
//       <DialogTitle className="text-2xl font-bold mb-2">
//         {activeQuiz?.quizTitle}
//       </DialogTitle>
//       {activeQuiz && (
//         <p className="text-sm text-muted-foreground mb-4">
//           Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
//         </p>
//       )}
//     </DialogHeader>

//     {currentQuestion ? (
//       <div key={currentQuestion._id} className="space-y-4">
//         <p className="text-lg font-medium">
//           {currentQuestion.questionText ?? currentQuestion.question ?? "Question not available"}
//         </p>
//         <RadioGroup
//           value={userAnswers[currentQuestion._id] || ""}
//           onValueChange={(val) => handleAnswerChange(currentQuestion._id, val)}
//           className="space-y-3"
//         >
//           {currentQuestion.options?.map((option, idx) => (
//             <div
//               key={idx}
//               className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
//             >
//               <RadioGroupItem value={option} id={`${currentQuestion._id}-${idx}`} />
//               <label htmlFor={`${currentQuestion._id}-${idx}`} className="cursor-pointer">
//                 {option}
//               </label>
//             </div>
//           ))}
//         </RadioGroup>
//       </div>
//     ) : (
//       <p className="text-sm text-red-500">No question found.</p>
//     )}

//     {score && (
//       <div
//         className={`text-lg font-semibold text-center mt-6 ${
//           (parseInt(score.split(" / ")[0]) / parseInt(score.split(" / ")[1])) < 0.4
//             ? "text-red-600"
//             : "text-green-600"
//         }`}
//       >
//         Your Score: {score}
//       </div>
//     )}

//     <DialogFooter className="flex justify-between mt-6">
//       <div className="flex gap-2">
//         {currentQuestionIndex > 0 && (
//           <Button
//             variant="outline"
//             onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
//           >
//             Back
//           </Button>
//         )}
//         {currentQuestionIndex < activeQuiz?.questions.length - 1 ? (
//           <Button onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>
//             Next
//           </Button>
//         ) : (
//           <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
//         )}
//       </div>
//     </DialogFooter>
//   </DialogContent>
// </Dialog>

//     </div>
//   );
// };

// export default CourseProgress;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Chat from "./Chat";


import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
  useGetQuizzesByCourseIdQuery,
} from "../../../features/api/courseProgressApi";

const CourseProgress = () => {
  const { courseId } = useParams();

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);
  const {
    data: quizzes,
    isLoading: quizLoading,
    isError: quizError,
  } = useGetQuizzesByCourseIdQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [completedSuccess, inCompletedSuccess]);

  if (isLoading) return <h1>Loading course...</h1>;
  if (isError) return <h1>Failed to get course details</h1>;

  const { courseDetails, progress, completed } = data.data;
  const initialLecture = currentLecture || courseDetails?.lectures?.[0];

  const isLectureCompleted = (lectureId) =>
    progress.some((prog) => prog.lectureId === lectureId && prog.viewed);

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  const handleOpenQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setUserAnswers({});
    setScore(null);
    setCurrentQuestionIndex(0);
    setQuizModalOpen(true);
  };

  const handleAnswerChange = (questionId, option) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;

    let correct = 0;

    activeQuiz.questions.forEach((q, index) => {
      const userAnswer = userAnswers[q._id];
      const correctAnswer = activeQuiz.correctAnswers[index];

      if (userAnswer === correctAnswer) correct++;
    });

    setScore(`${correct} / ${activeQuiz.questions.length}`);
  };

  const currentQuestion = activeQuiz?.questions?.[currentQuestionIndex];

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Title & Complete */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseDetails.courseTitle}</h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Completed</span>
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Video */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-md p-6 border border-gray-300 bg-white">
          <video
            src={currentLecture?.videoUrl || initialLecture?.videoUrl}
            controls
            className="w-full h-auto md:rounded-lg"
            onPlay={() =>
              handleLectureProgress(currentLecture?._id || initialLecture._id)
            }
          />
          <div className="mt-4">
            <h3 className="font-medium text-lg mb-2">
              {`Lecture ${
                courseDetails.lectures.findIndex(
                  (lec) =>
                    lec._id === (currentLecture?._id || initialLecture._id)
                ) + 1
              }: ${
                currentLecture?.lectureTitle || initialLecture?.lectureTitle
              }`}
            </h3>
          </div>
          <div className="mt-4">
            <Button
              className="w-full"
              onClick={() => {
                const materialUrl =
                  currentLecture?.materialUrl || initialLecture?.materialUrl;
                if (materialUrl) {
                  window.open(materialUrl, "_blank");
                } else {
                  toast.error("Material URL not available");
                }
              }}
            >
              View Material (PDF)
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer ${
                  lecture._id === currentLecture?._id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <CardTitle className="text-lg font-medium">
                      {lecture.lectureTitle}
                    </CardTitle>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant="outline"
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* QUIZZES */}
          <h2 className="font-semibold text-xl mt-6 mb-3">Course Quizzes</h2>
          {quizLoading ? (
            <p>Loading quizzes...</p>
          ) : quizError ? (
            <p className="text-red-500">Failed to load quizzes.</p>
          ) : quizzes?.length === 0 ? (
            <p>No quizzes available.</p>
          ) : (
            quizzes.map((quiz) => (
              <Card key={quiz._id} className="mb-3">
                <CardContent className="flex items-center justify-between p-4">
                  <CardTitle className="text-md font-medium">
                    {quiz.quizTitle}
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => handleOpenQuiz(quiz)}
                  >
                    Attempt Quiz
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* QUIZ MODAL */}
      <Dialog open={quizModalOpen} onOpenChange={setQuizModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">
              {activeQuiz?.quizTitle}
            </DialogTitle>
            {activeQuiz && (
              <p className="text-sm text-muted-foreground mb-4">
                Question {currentQuestionIndex + 1} of{" "}
                {activeQuiz.questions.length}
              </p>
            )}
          </DialogHeader>

          {currentQuestion ? (
            <div key={currentQuestion._id} className="space-y-4">
              <p className="text-lg font-medium">
                {currentQuestion.questionText ??
                  currentQuestion.question ??
                  "Question not available"}
              </p>
              <RadioGroup
                value={userAnswers[currentQuestion._id] || ""}
                onValueChange={(val) =>
                  handleAnswerChange(currentQuestion._id, val)
                }
                className="space-y-3"
              >
                {currentQuestion.options?.map((option, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`${currentQuestion._id}-${idx}`}
                    />
                    <label
                      htmlFor={`${currentQuestion._id}-${idx}`}
                      className="cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <p className="text-sm text-red-500">No question found.</p>
          )}

          {score && (
            <div
              className={`text-lg font-semibold text-center mt-6 ${
                parseInt(score.split(" / ")[0]) /
                  parseInt(score.split(" / ")[1]) <
                0.4
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              Your Score: {score}
            </div>
          )}

          <DialogFooter className="flex justify-between mt-6">
            <div className="flex gap-2">
              {currentQuestionIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  Back
                </Button>
              )}
              {currentQuestionIndex < activeQuiz?.questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
  onClick={toggleChat}
  className="fixed bottom-5 right-5 text-white px-4 py-2 rounded shadow"
>
  {isChatOpen ? "Close Chat" : "Chat"}
</Button>

      {isChatOpen && <Chat onClose={toggleChat} />}
    </div>
  );
};

export default CourseProgress;
