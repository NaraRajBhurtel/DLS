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
import { useLoginUserMutation, useRegisterUserMutation } from "../../features/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


 const SignIn = ()=> {

    const [signupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: "",
        role:""
      });

    const [loginInput, setLoginInput] = useState({ email: "", password: "" });

    const [
        registerUser,
        {
          data: registerData,
          error: registerError,
          isLoading: registerIsLoading,
          isSuccess: registerIsSuccess,
        },
      ] = useRegisterUserMutation();
      const [
        loginUser,
        {
          data: loginData,
          error: loginError,
          isLoading: loginIsLoading,
          isSuccess: loginIsSuccess,
        },
      ] = useLoginUserMutation();
        const navigate = useNavigate();


    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
          setSignupInput({ ...signupInput, [name]: value });
        } else {
          setLoginInput({ ...loginInput, [name]: value });
        }
      };

      const handleRegistration = async (type) => {
  const inputData = type === "signup" ? signupInput : loginInput;
  const action = type === "signup" ? registerUser : loginUser;

  try {
    const res = await action(inputData).unwrap(); // unwrap gives you the actual response or throws
    toast.success(res.message || `${type === "signup" ? "Signup" : "Login"} successful.`);

    const role = res.user?.role || res.role;

    if (type === "login" && role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  } catch (err) {
    toast.error(err.data?.message || `${type === "signup" ? "Signup" : "Login"} failed`);
  }
};

      useEffect(() => {
        if(registerIsSuccess && registerData){
          toast.success(registerData.message || "Signup successful.")
        }
        if(registerError){
          toast.error(registerError.data.message || "Signup Failed");
        }
        if(loginIsSuccess && loginData){
          toast.success(loginData.message || "Login successful.");
          navigate("/");
        }
        if(loginError){ 
          toast.error(loginError.data.message || "login Failed");
        }
      }, [
        loginIsLoading,
        registerIsLoading,
        loginData,
        registerData,
        loginError,
        registerError,
      ]);

  return (
    <div className = "flex item-center w-full justify-center mt-16">
        <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">SignUp</TabsTrigger>
            <TabsTrigger value="login">LogIn</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
            <Card>
            <CardHeader>
                <CardTitle>SignUp</CardTitle>
                <CardDescription>
                Register your Account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input 
                type='text' 
                name="name"
                value={signupInput.name}
                onChange={(e) => changeInputHandler(e, "signup")}
                placeholder="Eg NaraRaj"
                required = "true" />
                </div>
                <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input 
                type="email" 
                name="email"
                value={signupInput.email}   
                onChange={(e) => changeInputHandler(e, "signup")}
                placeholder="nr@gmail.com" 
                required = "true" />
                </div>
                <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input 
                type="password"
                name="password"
                value={signupInput.password}
                onChange={(e) => changeInputHandler(e, "signup")}
                placeholder="password" 
                required = "true" />
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
                  <option value="" disabled>Select your role</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>

                </select>
              </div>
            </CardContent>
            <CardFooter>
            <Button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="login">
            <Card>
            <CardHeader>
                <CardTitle>LogIn</CardTitle>
                <CardDescription>
                Welcome Back Login To Your Account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input 
                type="email"
                name="email"
                value={loginInput.email}
                onChange={(e) => changeInputHandler(e, "login")}
                placeholder="nr@gmail.com"
                 required = "true" />
                </div>
                <div className="space-y-1">
                <Label htmlFor="new">password</Label>
                <Input 
                type="password"
                name="password"
                value={loginInput.password}
                onChange={(e) => changeInputHandler(e, "login")}
                placeholder="password" 
                required = "true" />
                </div>
            </CardContent>
            <CardFooter>
            <Button
                disabled={loginIsLoading}
                onClick={() => handleRegistration("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
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

  )
}

export default SignIn
