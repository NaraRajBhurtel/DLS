import './App.css'
import SignIn from './pages/SignIn'
import { Button } from './components/ui/button'
import Navbar from './components/Navbar'
import Hero from './pages/student/Hero'
import RootLayout from './layouts/RootLayout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Courses from './pages/student/Courses'
import Mylearning from './pages/student/Mylearning'
import Profile from './pages/student/Profile'
import Sidebar from './pages/Sidebar'
import CourseTable from './pages/teacher/course/CourseTable'
import Dashboard from './pages/teacher/Dashboard'
import AddCourse from './pages/teacher/course/AddCourse'
import UpdateCourse from './pages/teacher/course/UpdateCourse'
import CreateLecture from './pages/teacher/lecture/CreateLecture'
import EditLecture from './pages/teacher/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { AuthenticatedUser, ProtectedRoute, TeacherRoute } from './components/ProtectedRoutes'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute'
import { ThemeProvider } from './components/ThemeProvider'

function App() {

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <Hero />
              <Courses />
            </>
          ),
        },
        {
        path: "login",
        element: (
          <AuthenticatedUser>
            <SignIn />
          </AuthenticatedUser>
        ),
      },
      {
        path: "my-learning",
        element: (
          <ProtectedRoute>
            <Mylearning />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-detail/:courseId",
        element: (
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute >
            <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },



        //teacher routes
       {
        
        path: "teacher",
        element:  (
          <TeacherRoute>
            <Sidebar />
          </TeacherRoute>),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable/>,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId",
            element: <UpdateCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },

          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },

       
        ]
   },
],
    }
]);
  

return (
<main>
  <ThemeProvider>
<RouterProvider router={appRouter} />

  </ThemeProvider>
</main>

)
}

export default App
