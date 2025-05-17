import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { sendVerificationEamil, senWelcomeEmail } from "../middlewares/Email.js"



// export const register = async (req,res) => {
//     try {
       
//         const {name, email, password, role, confirmPassword} = req.body; 
//         if(!name || !email || !password || !role || !confirmPassword){
//             return res.status(400).json({
//                 success:false,
//                 message:"All fields are required."
//             })
//         }
//         const user = await User.findOne({email});
//         if(user){
//             return res.status(400).json({
//                 success:false,
//                 message:"User already exist with this email."
//             })
//         }
//         if (req.body.role === "admin") {
//     const existingAdmin = await User.findOne({ role: "admin" });
//     if (existingAdmin) {
//         return res.status(400).json({ message: "Admin account already exists" });
//     }
// }

//         if (password !== confirmPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Passwords do not match.",
//             });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const verficationToken= Math.floor(100000 + Math.random() * 900000).toString()
//         const verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
//         await User.create({
//             name,
//             email,
//             password:hashedPassword,
//             role,
//             verficationToken: verficationToken,
//             verficationTokenExpiresAt: verificationTokenExpiresAt,
//         });

//         await sendVerificationEamil(email,verficationToken)
//         return res.status(201).json({
//             success:true,
//             message: "OTP sent to your email. Please verify to complete registration."
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"Failed to register"
//         })
//     }
// }

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Check for missing fields
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email must end with @gmail.com
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Email must end with @gmail.com" });
    }

    // Password should be at least 8 characters
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Confirm password must match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    console.log("Verification Token:", verificationToken);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
    });

    // Send email with OTP
    await sendVerificationEamil(newUser.email,verificationToken);

    return res.status(201).json({ message: "User registered. Check your email for the verification code." });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

export const VerifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationToken !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    await senWelcomeEmail(user.email, user.name);

    return res.status(200).json({ success: true, message: "Email Verified Successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            })
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email not verified. Please verify your email before logging in."
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect email password"
            });
        }


        // Sanitize user object here before sending
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
      enrolledCourses: user.enrolledCourses,
      
    };

    generateToken(res, safeUser, `Welcome back ${user.name}`);
        // generateToken(res, user, `Welcome back ${user.name}`);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to login"
        })
    }
}



export const logout = async (_,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        }) 
    }
}

export const getUserProfile = async (req,res) => {
    try {
        const userId = req.id;
        
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        })
    }
}
export const updateProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            }) 
        }
        // extract public id of the old image from the url is it exists;
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
            deleteMediaFromCloudinary(publicId);
        }

        // upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;

        const updatedData = {name, photoUrl};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
    }
}
