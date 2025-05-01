import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["instructor", "student"],
        // default:"student"
        require:true
        
    },
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course'
        }
    ],
    photoUrl:{
        type:String,
        default:""
    }
},{timestamps:true});

export const User = mongoose.model("User", userSchema);



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