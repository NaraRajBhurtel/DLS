import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { Quiz } from "../models/quiz.model.js";
import mongoose from "mongoose";




import {deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia} from "../utils/cloudinary.js";




export const createCourse = async (req,res) => {
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category) {
            return res.status(400).json({
                message:"Course title and category is required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator:req.id
        });

        return res.status(201).json({
            course,
            message:"Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}
export const searchCourse = async (req,res) => {
    try {
        const {query = "", categories = [], sortByPrice =""} = req.query;
        console.log(categories);
        
        // create search query
        const searchCriteria = {
            isPublished:true,
            $or:[
                {courseTitle: {$regex:query, $options:"i"}},
                {subTitle: {$regex:query, $options:"i"}},
                {category: {$regex:query, $options:"i"}},
            ]
        }

        // if categories selected
        if(categories.length > 0) {
            searchCriteria.category = {$in: categories};
        }

        // define sorting order
        const sortOptions = {};
        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;//sort by price in ascending
        }else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1; // descending
        }

        let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            success:true,
            courses: courses || []
        });

    } catch (error) {
        console.log(error);
        
    }
}

export const getPublishedCourse = async (_,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published courses"
        })
    }
}

export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId});
        if(!courses){
            return res.status(404).json({
                courses:[],
                message:"Course not found"
            })
        };
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}

export const editCourse = async (req,res) => {
    try {
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // delete old image
            }
            // upload a thumbnail on clourdinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

 
        const updateData = {courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail:courseThumbnail?.secure_url};

        course = await Course.findByIdAndUpdate(courseId, updateData, {new:true});

        return res.status(200).json({
            course,
            message:"Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}

export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);
        

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course by id"
        })
    }
}

export const createLecture = async (req,res) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        };                                              

        // create lecture
        const lecture = await Lecture.create({lectureTitle});

        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message:"Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create lecture"
        })
    }
}

export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lectures"
        })
    }
}

export const editLecture = async (req,res) => {
    try {
        const {lectureTitle, videoInfo, materialInfo, isPreviewFree} = req.body;
        
        console.log("Request Body:", req.body);
        const {courseId, lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }

        // update lecture
        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        if(materialInfo?.materialUrl) lecture.materialUrl = materialInfo.materialUrl;
        if(materialInfo?.matPublicId) lecture.matPublicId = materialInfo.matPublicId;
        lecture.isPreviewFree = isPreviewFree;

        console.log("Updated Lecture Before Save:", lecture); // Debugging
        await lecture.save();
        console.log("Updated Lecture After Save:", lecture); // Debuggin;

        // Ensure the course still has the lecture id if it was not aleardy added;
        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message:"Lecture updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit lectures"
        })
    }
}
export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }
        if (lecture.matPublicId) {
            console.log("Deleting material with publicId:", lecture.matPublicId);
            await deleteMediaFromCloudinary(lecture.matPublicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures:lectureId}, // find the course that contains the lecture
            {$pull:{lectures:lectureId}} // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message:"Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}
export const getLectureById = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture by id"
        })
    }
}


export const togglePublishCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // true, false
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            });
        }
        // publish status based on the query paramter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message:`Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}


export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        // Delete all associated lectures
        if (course.lectures && course.lectures.length > 0) {
            await Lecture.deleteMany({ _id: { $in: course.lectures } });
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({ message: "Course removed successfully." });
    } catch (error) {
        console.error("Error removing course:", error);
        return res.status(500).json({ message: "Failed to remove course." });
    }
};

export const createQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;  // Assuming courseId is passed in the URL
    const { quizTitle, questions, correctAnswers } = req.body;

    // Create the quiz document
    const newQuiz = new Quiz({
      quizTitle,
      questions,
      correctAnswers,
    });

    await newQuiz.save();

    // Find the course and add the quiz reference to its quizzes array
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    course.quizzes.push(newQuiz._id);  // Add quiz reference to the course
    await course.save();

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create quiz",
    });
  }
};

  
  // Edit a quiz
  export const editQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const { quizTitle, questions, correctAnswers } = req.body;
  
      if (!quizTitle || !questions || !correctAnswers) {
        return res.status(400).json({ message: 'Quiz title, questions, and correct answers are required' });
      }
  
      const quiz = await Quiz.findById(quizId);
  
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      // Update quiz
      quiz.quizTitle = quizTitle;
      quiz.questions = questions;
      quiz.correctAnswers = correctAnswers;
  
      await quiz.save();
  
      res.status(200).json({
        message: 'Quiz updated successfully',
        quiz: quiz,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
  // Get quiz by ID
  export const getQuizById = async (req, res) => {
    try {
      const { quizId } = req.params;
  
      const quiz = await Quiz.findById(quizId);
  
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      res.status(200).json(quiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  export const removeQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await Quiz.findByIdAndDelete(quizId);
  
      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found",
        });
      }
  
      // Remove quiz reference from courses
      await Course.updateMany(
        { quizzes: quizId },
        { $pull: { quizzes: quizId } }
      );
  
      return res.status(200).json({
        message: "Quiz removed successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to remove quiz",
      });
    }
  };




export const getCourseQuizzes = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await Course.findById(courseId).populate('quizzes');  // Make sure quizzes are populated
  
      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }
  
      return res.status(200).json({
        quizzes: course.quizzes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to get quizzes",
      });
    }
  };
  
