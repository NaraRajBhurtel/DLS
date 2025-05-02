import { Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const Quiz = ({ quiz, courseId }) => {
  const navigate = useNavigate();

  const goToEditQuiz = () => {
    navigate(`/teacher/course/${courseId}/quizzes/${quiz._id}`);
  };

  return (
    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-md my-2">
      <h1 className="font-semibold text-gray-800">{quiz.quizTitle}</h1>
      <Edit
        size={20}
        className="text-blue-600 cursor-pointer"
        onClick={goToEditQuiz}
      />
    </div>
  );
};

export default Quiz;
