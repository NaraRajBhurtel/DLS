// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { useCreateLectureMutation, useGetCourseLectureQuery } from '../../../../features/api/courseApi'
// import { Loader2 } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { toast } from 'sonner'
// import Lecture from './Lecture'

// const CreateLecture = () => {

//     const [lectureTitle, setLectureTitle] = useState("")
//     const params = useParams();
//     const courseId = params.courseId;

//     const navigate = useNavigate()

//     const [createLecture, { data, isLoading, isSuccess, error }] =
//     useCreateLectureMutation();

//     const {
//         data: lectureData,
//         isLoading: lectureLoading,
//         isError: lectureError,
//         refetch,
//       } = useGetCourseLectureQuery(courseId);

//     const createLectureHandler = async () => {
//         await createLecture({ lectureTitle, courseId });
//       };

//     // for displaying toast
//     useEffect(() => {
//         if (isSuccess) {
//           refetch();
//           toast.success(data.message);
//         }
//         if (error) {
//           toast.error(error.data.message);
//         }
//       }, [isSuccess, error]);
    
//       console.log(lectureData);


//   return (
//     <div className="flex-1 mx-10">
//       <div className="mb-4">
//         <h1 className="font-bold text-xl">
//           Lets add lecture
//         </h1>
//       </div>

//       <div className="space-y-4">
//         <div className="mt-4">
//           <Label>Title</Label>
//           <Input
//             type="text"
//             value={lectureTitle}
//             onChange={(e) => setLectureTitle(e.target.value)}
//             placeholder="Lecture Name"
//           />
//         </div>
//           <div className="flex items-center gap-2 mt-8">
//           <Button variant="outline" onClick={() => navigate(`/teacher/course/${courseId}`)}>
//             Back
//           </Button>
//           <Button disabled={isLoading} onClick = {createLectureHandler}>
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Please wait
//               </>
//             ) : (
//               "Create Lecture"
//             )}
//           </Button>
//         </div>
//         <div className="mt-10">
//           {lectureLoading ? (
//             <p>Loading lectures...</p>
//           ) : lectureError ? (
//             <p>Failed to load lectures.</p>
//           ) : lectureData.lectures.length === 0 ? (
//             <p>No lectures availabe</p>
//           ) : (
//             lectureData.lectures.map((lecture, index) => (
//               <Lecture
//                 key={lecture._id}
//                 lecture={lecture}
//                 courseId={courseId}
//                 index={index}
//               />
//             ))
//           )}
//         </div>

//         </div>
//     </div>
//   )
// }

// export default CreateLecture

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Loader2 } from 'lucide-react';
// import { toast } from 'sonner';

// import {
//   useCreateLectureMutation,
//   useGetCourseLectureQuery,
//   useCreateQuizMutation,
//   useGetCourseQuizzesQuery,
// } from '../../../../features/api/courseApi';

// import Lecture from './Lecture';

// const CreateLecture = () => {
//   const [lectureTitle, setLectureTitle] = useState('');
//   const [quizTitle, setQuizTitle] = useState('');

//   const params = useParams();
//   const courseId = params.courseId;
//   const navigate = useNavigate();

//   const [createLecture, { data: lectureDataRes, isLoading: isCreatingLecture, isSuccess: lectureSuccess, error: lectureError }] =
//     useCreateLectureMutation();

//   const {
//     data: lectureData,
//     isLoading: lectureLoading,
//     isError: lectureFetchError,
//     refetch: refetchLectures,
//   } = useGetCourseLectureQuery(courseId);

//   const [createQuiz, { isLoading: quizLoading, isSuccess: quizSuccess, error: quizError }] = useCreateQuizMutation();

//   const {
//     data: quizData,
//     isLoading: quizListLoading,
//     isError: quizListError,
//     refetch: refetchQuizzes,
//   } = useGetCourseQuizzesQuery(courseId);

//   const createLectureHandler = async () => {
//     if (!lectureTitle.trim()) {
//       toast.error("Lecture title is required");
//       return;
//     }
//     await createLecture({ lectureTitle, courseId });
//   };

//   const createQuizHandler = async () => {
//     if (!quizTitle.trim()) {
//       toast.error("Quiz title is required");
//       return;
//     }
//     const res = await createQuiz({ quizTitle, courseId });
//     if (res?.data?.quizId) {
//       navigate(`/teacher/course/${courseId}/edit-quiz/${res.data.quizId}`);
//     }
//   };

//   useEffect(() => {
//     if (lectureSuccess) {
//       toast.success(lectureDataRes.message);
//       refetchLectures();
//       setLectureTitle('');
//     }
//     if (lectureError) {
//       toast.error(lectureError.data.message);
//     }
//   }, [lectureSuccess, lectureError]);

//   useEffect(() => {
//     if (quizSuccess) {
//       refetchQuizzes();
//       setQuizTitle('');
//     }
//     if (quizError) {
//       toast.error(quizError.data.message);
//     }
//   }, [quizSuccess, quizError]);

//   return (
//     <div className="flex-1 mx-10">
//       <div className="mb-4">
//         <h1 className="font-bold text-xl">Add Lecture or Quiz</h1>
//       </div>

//       <div className="space-y-4">
//         {/* Lecture Form */}
//         <div className="mt-4">
//           <Label>Lecture Title</Label>
//           <Input
//             type="text"
//             value={lectureTitle}
//             onChange={(e) => setLectureTitle(e.target.value)}
//             placeholder="Enter lecture title"
//           />
//         </div>

//         <div className="flex items-center gap-2 mt-4">
//           <Button variant="outline" onClick={() => navigate(`/teacher/course/${courseId}`)}>
//             Back
//           </Button>
//           <Button disabled={isCreatingLecture} onClick={createLectureHandler}>
//             {isCreatingLecture ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Please wait
//               </>
//             ) : (
//               'Create Lecture'
//             )}
//           </Button>
//         </div>

//         {/* Quiz Form */}
//         <div className="mt-10">
//           <Label>Quiz Title</Label>
//           <Input
//             type="text"
//             value={quizTitle}
//             onChange={(e) => setQuizTitle(e.target.value)}
//             placeholder="Enter quiz title"
//           />
//           <Button disabled={quizLoading} onClick={createQuizHandler} className="mt-2">
//             {quizLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               'Create Quiz'
//             )}
//           </Button>
//         </div>

//         {/* Lectures List */}
//         <div className="mt-10">
//           <h2 className="text-lg font-semibold mb-2">Lectures</h2>
//           {lectureLoading ? (
//             <p>Loading lectures...</p>
//           ) : lectureFetchError ? (
//             <p>Failed to load lectures.</p>
//           ) : lectureData?.lectures?.length === 0 ? (
//             <p>No lectures available.</p>
//           ) : (
//             lectureData?.lectures?.map((lecture, index) => (
//               <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
//             ))
//           )}
//         </div>

//         {/* Quizzes List */}
//         <div className="mt-10">
//           <h2 className="text-lg font-semibold mb-2">Quizzes</h2>
//           {quizListLoading ? (
//             <p>Loading quizzes...</p>
//           ) : quizListError ? (
//             <p>Failed to load quizzes.</p>
//           ) : quizData?.quizzes?.length === 0 ? (
//             <p>No quizzes available.</p>
//           ) : (
//             quizData?.quizzes?.map((quiz, index) => (
//               <div
//                 key={quiz._id}
//                 className="flex items-center justify-between border rounded-lg p-3 shadow-sm mb-2"
//               >
//                 <p className="font-medium">{index + 1}. {quiz.quizTitle}</p>
//                 <Button
//                   variant="secondary"
//                   onClick={() => navigate(`/teacher/course/${courseId}/edit-quiz/${quiz._id}`)}
//                 >
//                   Edit Quiz
//                 </Button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateLecture;


import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useCreateQuizMutation,
  useGetCourseQuizzesQuery,
} from '../../../../features/api/courseApi';

import Lecture from './Lecture';
import Quiz from './Quiz'; // Import the Quiz component

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState('');
  const [quizTitle, setQuizTitle] = useState('');

  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data: lectureDataRes, isLoading: isCreatingLecture, isSuccess: lectureSuccess, error: lectureError }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureFetchError,
    refetch: refetchLectures,
  } = useGetCourseLectureQuery(courseId);

  const [createQuiz, { isLoading: quizLoading, isSuccess: quizSuccess, error: quizError }] = useCreateQuizMutation();

  const {
    data: quizData,
    isLoading: quizListLoading,
    isError: quizListError,
    refetch: refetchQuizzes,
  } = useGetCourseQuizzesQuery(courseId);

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }
    await createLecture({ lectureTitle, courseId });
  };

  const createQuizHandler = async () => {
    if (!quizTitle.trim()) {
      toast.error("Quiz title is required");
      return;
    }
    const res = await createQuiz({ quizTitle, courseId });
    if (res?.data?.quizId) {
      navigate(`/teacher/course/${courseId}/edit-quiz/${res.data.quizId}`);
    }
  };

  useEffect(() => {
    if (lectureSuccess) {
      toast.success(lectureDataRes.message);
      refetchLectures();
      setLectureTitle('');
    }
    if (lectureError) {
      toast.error(lectureError.data.message);
    }
  }, [lectureSuccess, lectureError]);

  useEffect(() => {
    if (quizSuccess) {
      refetchQuizzes();
      setQuizTitle('');
    }
    if (quizError) {
      toast.error(quizError.data.message);
    }
  }, [quizSuccess, quizError]);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Add Lecture or Quiz</h1>
      </div>

      <div className="space-y-4">
        {/* Lecture Form */}
        <div className="mt-4">
          <Label>Lecture Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter lecture title"
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" onClick={() => navigate(`/teacher/course/${courseId}`)}>
            Back
          </Button>
          <Button disabled={isCreatingLecture} onClick={createLectureHandler}>
            {isCreatingLecture ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Create Lecture'
            )}
          </Button>
        </div>

        {/* Quiz Form */}
        <div className="mt-10">
          <Label>Quiz Title</Label>
          <Input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
          />
          <Button disabled={quizLoading} onClick={createQuizHandler} className="mt-2">
            {quizLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Quiz'
            )}
          </Button>
        </div>

        {/* Lectures List */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">Lectures</h2>
          {lectureLoading ? (
            <p>Loading lectures...</p>
          ) : lectureFetchError ? (
            <p>Failed to load lectures.</p>
          ) : lectureData?.lectures?.length === 0 ? (
            <p>No lectures available.</p>
          ) : (
            lectureData?.lectures?.map((lecture, index) => (
              <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
            ))
          )}
        </div>

        {/* Quizzes List */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">Quizzes</h2>
          {quizListLoading ? (
            <p>Loading quizzes...</p>
          ) : quizListError ? (
            <p>Failed to load quizzes.</p>
          ) : quizData?.quizzes?.length === 0 ? (
            <p>No quizzes available.</p>
          ) : (
            quizData?.quizzes?.map((quiz, index) => (
              <Quiz key={quiz._id} quiz={quiz} courseId={courseId} index={index} /> // Render quizzes using Quiz component
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
