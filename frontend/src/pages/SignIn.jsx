// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { useLoginUserMutation, useRegisterUserMutation } from "../../features/api/authApi";
// import { Loader2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";


//  const SignIn = ()=> {

//     const [signupInput, setSignupInput] = useState({
//         name: "",
//         email: "",
//         password: "",
//         role:""
//       });

//     const [loginInput, setLoginInput] = useState({ email: "", password: "" });

//     const [
//         registerUser,
//         {
//           data: registerData,
//           error: registerError,
//           isLoading: registerIsLoading,
//           isSuccess: registerIsSuccess,
//         },
//       ] = useRegisterUserMutation();
//       const [
//         loginUser,
//         {
//           data: loginData,
//           error: loginError,
//           isLoading: loginIsLoading,
//           isSuccess: loginIsSuccess,
//         },
//       ] = useLoginUserMutation();
//         const navigate = useNavigate();


//     const changeInputHandler = (e, type) => {
//         const { name, value } = e.target;
//         if (type === "signup") {
//           setSignupInput({ ...signupInput, [name]: value });
//         } else {
//           setLoginInput({ ...loginInput, [name]: value });
//         }
//       };

//       const handleRegistration = async (type) => {
//   const inputData = type === "signup" ? signupInput : loginInput;
//   const action = type === "signup" ? registerUser : loginUser;

//   try {
//     const res = await action(inputData).unwrap(); // unwrap gives you the actual response or throws
//     toast.success(res.message || `${type === "signup" ? "Signup" : "Login"} successful.`);

//     const role = res.user?.role || res.role;

//     if (type === "login" && role === "admin") {
//       navigate("/admin/dashboard");
//     } else {
//       navigate("/");
//     }
//   } catch (err) {
//     toast.error(err.data?.message || `${type === "signup" ? "Signup" : "Login"} failed`);
//   }
// };

//       useEffect(() => {
//         if(registerIsSuccess && registerData){
//           toast.success(registerData.message || "Signup successful.")
//         }
//         if(registerError){
//           toast.error(registerError.data.message || "Signup Failed");
//         }
//         if(loginIsSuccess && loginData){
//           toast.success(loginData.message || "Login successful.");
//           navigate("/");
//         }
//         if(loginError){ 
//           toast.error(loginError.data.message || "login Failed");
//         }
//       }, [
//         loginIsLoading,
//         registerIsLoading,
//         loginData,
//         registerData,
//         loginError,
//         registerError,
//       ]);

//   return (
//     <div className = "flex item-center w-full justify-center mt-16">
//         <Tabs defaultValue="account" className="w-[400px]">
//         <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="signup">SignUp</TabsTrigger>
//             <TabsTrigger value="login">LogIn</TabsTrigger>
//         </TabsList>
//         <TabsContent value="signup">
//             <Card>
//             <CardHeader>
//                 <CardTitle>SignUp</CardTitle>
//                 <CardDescription>
//                 Register your Account
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-2">
//                 <div className="space-y-1">
//                 <Label htmlFor="name">Name</Label>
//                 <Input 
//                 type='text' 
//                 name="name"
//                 value={signupInput.name}
//                 onChange={(e) => changeInputHandler(e, "signup")}
//                 placeholder="Eg NaraRaj"
//                 required = "true" />
//                 </div>
//                 <div className="space-y-1">
//                 <Label htmlFor="username">Email</Label>
//                 <Input 
//                 type="email" 
//                 name="email"
//                 value={signupInput.email}   
//                 onChange={(e) => changeInputHandler(e, "signup")}
//                 placeholder="nr@gmail.com" 
//                 required = "true" />
//                 </div>
//                 <div className="space-y-1">
//                 <Label htmlFor="username">Password</Label>
//                 <Input 
//                 type="password"
//                 name="password"
//                 value={signupInput.password}
//                 onChange={(e) => changeInputHandler(e, "signup")}
//                 placeholder="password" 
//                 required = "true" />
//                 </div>
//                 <div className="space-y-1">
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <Input
//                   type="password"
//                   name="confirmPassword"
//                   value={signupInput.confirmPassword}
//                   onChange={(e) => changeInputHandler(e, "signup")}
//                   placeholder="Confirm password"
//                   required
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label htmlFor="role">Role</Label>
//                 <select
//                   name="role"
//                   value={signupInput.role}
//                   onChange={(e) => changeInputHandler(e, "signup")}
//                   className="w-full border rounded px-2 py-1"
//                   required
//                 >
//                   <option value="" disabled>Select your role</option>
//                   <option value="admin">Admin</option>
//                   <option value="student">Student</option>
//                   <option value="instructor">Instructor</option>

//                 </select>
//               </div>
//             </CardContent>
//             <CardFooter>
//             <Button
//                 disabled={registerIsLoading}
//                 onClick={() => handleRegistration("signup")}
//               >
//                 {registerIsLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
//                     wait
//                   </>
//                 ) : (
//                   "Signup"
//                 )}
//               </Button>
//             </CardFooter>
//             </Card>
//         </TabsContent>
//         <TabsContent value="login">
//             <Card>
//             <CardHeader>
//                 <CardTitle>LogIn</CardTitle>
//                 <CardDescription>
//                 Welcome Back Login To Your Account
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-2">
//                 <div className="space-y-1">
//                 <Label htmlFor="current">Email</Label>
//                 <Input 
//                 type="email"
//                 name="email"
//                 value={loginInput.email}
//                 onChange={(e) => changeInputHandler(e, "login")}
//                 placeholder="nr@gmail.com"
//                  required = "true" />
//                 </div>
//                 <div className="space-y-1">
//                 <Label htmlFor="new">password</Label>
//                 <Input 
//                 type="password"
//                 name="password"
//                 value={loginInput.password}
//                 onChange={(e) => changeInputHandler(e, "login")}
//                 placeholder="password" 
//                 required = "true" />
//                 </div>
//             </CardContent>
//             <CardFooter>
//             <Button
//                 disabled={loginIsLoading}
//                 onClick={() => handleRegistration("login")}
//               >
//                 {loginIsLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
//                     wait
//                   </>
//                 ) : (
//                   "Login"
//                 )}
//                 </Button>
//             </CardFooter>
//             </Card>
//         </TabsContent>
//         </Tabs>
//     </div>

//   )
// }

// export default SignIn


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useVerifyEmailMutation,
} from "../../features/api/authApi";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  // New: store whether to show OTP field
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const [
    registerUser,
    { data: registerData, error: registerError, isLoading: registerIsLoading },
  ] = useRegisterUserMutation();

  const [
    verifyEmail,
    { data: verifyData, error: verifyError, isLoading: verifyIsLoading },
  ] = useVerifyEmailMutation();

  const [
    loginUser,
    { data: loginData, error: loginError, isLoading: loginIsLoading },
  ] = useLoginUserMutation();

  // Handle input changes
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  // Validate signup inputs before calling API
  const validateSignup = () => {
    const { name, email, password, confirmPassword, role } = signupInput;

    if (!name || !email || !password || !confirmPassword || !role) {
      toast.error("Please fill all signup fields.");
      return false;
    }

    if (!email.endsWith("@gmail.com")) {
      toast.error("Email must end with @gmail.com");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  // Handle signup button click
  const handleSignup = async () => {
    if (!validateSignup()) return;

    try {
      const res = await registerUser(signupInput).unwrap();
      toast.success(res.message || "Signup successful! Check email for OTP.");
      setShowOtpInput(true);
    } catch (err) {
      toast.error(err.data?.message || "Signup failed");
    }
  };

  // Handle OTP verification button click
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await verifyEmail({ email: signupInput.email, otp }).unwrap();
      toast.success(res.message || "Email verified successfully!");
      setShowOtpInput(false);

      // Optionally clear signup inputs or redirect to login tab
      setSignupInput({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    } catch (err) {
      toast.error(err.data?.message || "OTP verification failed");
    }
  };

  // Handle login button click
  const handleLogin = async () => {
    const { email, password } = loginInput;

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      const res = await loginUser(loginInput).unwrap();

      if (!res.user.isVerified) {
        toast.error("Email not verified. Please verify your email before login.");
        return;
      }

      toast.success(res.message || "Login successful.");

      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center w-full justify-center mt-16">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">SignUp</TabsTrigger>
          <TabsTrigger value="login">LogIn</TabsTrigger>
        </TabsList>

        {/* SIGNUP TAB */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>SignUp</CardTitle>
              <CardDescription>Register your Account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {!showOtpInput ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      value={signupInput.name}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      placeholder="Eg NaraRaj"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={signupInput.email}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      placeholder="nr@gmail.com"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      value={signupInput.password}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={signupInput.confirmPassword}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="role">Role</Label>
                    <select
                      name="role"
                      value={signupInput.role}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      className="w-full border rounded px-2 py-1"
                      required
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      <option value="admin">Admin</option>
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>
                </>
              ) : (
                // Show OTP input field after signup
                <div className="space-y-1">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!showOtpInput ? (
                <Button onClick={handleSignup} disabled={registerIsLoading}>
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              ) : (
                <Button onClick={handleVerifyOtp} disabled={verifyIsLoading}>
                  {verifyIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* LOGIN TAB */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>LogIn</CardTitle>
              <CardDescription>Welcome Back! Login To Your Account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="nr@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLogin} disabled={loginIsLoading}>
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignIn;
