import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetQuizByIdQuery,
  useEditQuizMutation,
} from "../../../../features/api/courseApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const EditQuiz = () => {
  const { quizId, courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetQuizByIdQuery({ quizId, courseId });
  const [editQuiz] = useEditQuizMutation();

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (data?.quiz) {
      setQuizTitle(data.quiz.quizTitle || "");
      const formattedQuestions = data.quiz.questions.map((q, index) => ({
        questionText: q.question,
        options: q.options,
        correctAnswer: data.quiz.correctAnswers
          ? q.options.indexOf(data.quiz.correctAnswers[index])
          : 0,
      }));
      setQuestions(formattedQuestions);
    }
  }, [data]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "questionText") {
      newQuestions[index][field] = value;
    } else {
      newQuestions[index].options[field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index, correctIndex) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = correctIndex;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    try {
      const correctAnswers = questions.map((q) => q.options[q.correctAnswer]);
      const formattedQuestions = questions.map((q) => ({
        question: q.questionText,
        options: q.options,
      }));

      const updatedQuiz = {
        quizTitle,
        questions: formattedQuestions,
        correctAnswers,
      };

      await editQuiz({ courseId, quizId, quizData: updatedQuiz }).unwrap();
      toast.success("Quiz was successfully saved.");
      navigate(-1);
    } catch (err) {
      console.error("Failed to update quiz:", err);
      toast.error("Failed to update quiz");
    }
  };

  if (isLoading) return <p>Loading quiz...</p>;
  if (error) return <p>Failed to load quiz.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Quiz</h2>
      </div>

      <input
        type="text"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        className="mb-6 p-3 border rounded w-full"
        placeholder="Quiz Title"
      />

      {questions.map((q, idx) => (
        <div key={idx} className="mb-6 p-4 border rounded-md bg-gray-50">
          <input
            type="text"
            value={q.questionText}
            onChange={(e) =>
              handleQuestionChange(idx, "questionText", e.target.value)
            }
            className="mb-3 p-2 border rounded w-full"
            placeholder={`Question ${idx + 1}`}
          />

          {q.options.map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center mb-2">
              <input
                type="text"
                value={opt}
                onChange={(e) =>
                  handleQuestionChange(idx, optIdx, e.target.value)
                }
                className="p-2 border rounded w-full mr-3"
                placeholder={`Option ${optIdx + 1}`}
              />
              <input
                type="radio"
                name={`correct-${idx}`}
                checked={q.correctAnswer === optIdx}
                onChange={() => handleCorrectAnswerChange(idx, optIdx)}
              />
              <span className="ml-2 text-sm text-gray-600">Correct</span>
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => handleRemoveQuestion(idx)}
              size="sm"
            >
              Remove Question
            </Button>
          </div>
        </div>
      ))}

      <div className="mb-6">
        <Button variant="secondary" onClick={handleAddQuestion}>
          + Add Question
        </Button>
      </div>

      <div className="flex justify-end gap-4">
        <Button onClick={() => navigate(-1)}>← Back</Button>
        <Button onClick={handleSave}>Save Quiz</Button>
      </div>
    </div>
  );
};

export default EditQuiz;
