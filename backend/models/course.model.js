import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    subTitle: {type:String}, 
    description:{ type:String},
    category:{
        type:String,
        required:true
    },
    courseLevel:{
        type:String,
        enum:["Beginner", "Medium", "Advance"]
    },
    coursePrice:{
        type:Number
    },
    courseThumbnail:{
        type:String
    },
    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],

    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isPublished:{
        type:Boolean,
        default:false
    }

}, {timestamps:true});

export const Course = mongoose.model("Course", courseSchema);

// import mongoose from "mongoose";
// import validator from "validator"; // Install this package if not already installed

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Name is required"],
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//     validate: {
//       validator: validator.isEmail,
//       message: "Please provide a valid email address",
//     },
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//     minlength: [8, "Password must be at least 8 characters long"],
//     select: false, // Prevents password from being returned in queries
//   },
//   role: {
//     type: String,
//     enum: ["student", "teacher"], // Only allow these roles
//     default: "student",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export const User = mongoose.model("User", userSchema);