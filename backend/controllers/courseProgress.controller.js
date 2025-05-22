
import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";
import { Quiz } from "../models/quiz.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
          quizzes: [],
        },
      });
    }

    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
        quizzes: courseProgress.quizAttempts, // Include quiz attempts in the response
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching course progress" });
  }
};


// New endpoint to fetch quizzes by course ID
export const getQuizzesByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("quizzes");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course.quizzes);
  } catch (error) {
    console.error("Error fetching quizzes by course ID:", error);
    return res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};
// Handle quiz attempt submission
// export const submitQuizAttempt = async (req, res) => {
//   try {
//     const { courseId, quizId } = req.params;
//     const userId = req.id;
//     const { studentAnswers } = req.body;  // Assuming answers are provided in the request body

//     // Find course progress
//     let courseProgress = await CourseProgress.findOne({ courseId, userId });

//     if (!courseProgress) {
//       courseProgress = new CourseProgress({
//         userId,
//         courseId,
//         completed: false,
//         lectureProgress: [],
//         quizAttempts: [],
//       });
//     }

//     // Find the quiz
//     const quiz = await Quiz.findById(quizId);

//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     // Calculate score
//     let score = 0;
//     studentAnswers.forEach((answer, index) => {
//       if (answer === quiz.questions[index]?.correctAnswer) {
//         score += 1;
//       }
//     });

//     // Store the quiz attempt in the course progress
//     const quizAttempt = {
//       quizId,
//       studentAnswers,
//       score,
//       completed: true,
//     };

//     courseProgress.quizAttempts.push(quizAttempt);
//     await courseProgress.save();

//     return res.status(200).json({
//       message: "Quiz submitted successfully",
//       score: score,
//       totalQuestions: quiz.questions.length,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error submitting quiz" });
//   }
// };

export const submitQuizAttempt = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const userId = req.id;
    const { studentAnswers } = req.body;

    console.log("courseId:", courseId);
    console.log("quizId:", quizId);
    console.log("userId:", userId);
    console.log("studentAnswers:", studentAnswers);

    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
        quizAttempts: [],
      });
    }

    const quiz = await Quiz.findById(quizId);
    console.log("quiz:", quiz);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    console.log("quiz.correctAnswers:", quiz.correctAnswers);

    let score = 0;
    const totalQuestions = quiz.correctAnswers.length;

    studentAnswers.forEach((answer, index) => {
      if (answer === quiz.correctAnswers[index]) {
        score += 1;
      }
    });

    // Create quiz attempt object
    const quizAttempt = {
      quizId,
      studentAnswers,
      score,
      completed: true,
      submittedAt: new Date(),
    };

    // Save quiz attempt
    courseProgress.quizAttempts.push(quizAttempt);
    await courseProgress.save();

    return res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error submitting quiz" });
  }
};

// Handle review of the quiz attempt
export const reviewQuizAttempt = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      return res.status(404).json({ message: "Course progress not found" });
    }

    // Get all attempts for this quiz
    const attempts = courseProgress.quizAttempts.filter(
      (quiz) => quiz.quizId.toString() === quizId
    );

    if (!attempts.length) {
      return res.status(404).json({ message: "Quiz attempt not found" });
    }

    // Get the latest attempt
    const latestAttempt = attempts[attempts.length - 1];

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Return quiz attempt details, including student's answers and score
    return res.status(200).json({
      quizAttempt: latestAttempt,
      quiz: quiz,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error reviewing quiz" });
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      // If no progress exist, create a new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    // find the lecture progress in the course progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );

    if (lectureIndex !== -1) {
      // if lecture already exist, update its status
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      // Add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    // if all lecture is complete
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed
    ).length;

    const course = await Course.findById(courseId);

    if (course.lectures.length === lectureProgressLength)
      courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });

    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({ message: "Course marked as completed." });
  } catch (error) {
    console.log(error);
  }
};

export const markAsInCompleted = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.id;
  
      const courseProgress = await CourseProgress.findOne({ courseId, userId });
      if (!courseProgress)
        return res.status(404).json({ message: "Course progress not found" });
  
      courseProgress.lectureProgress.map(
        (lectureProgress) => (lectureProgress.viewed = false)
      );
      courseProgress.completed = false;
      await courseProgress.save();
      return res.status(200).json({ message: "Course marked as incompleted." });
    } catch (error) {
      console.log(error);
    }
  };
