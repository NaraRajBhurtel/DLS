import './App.css';
import SignIn from './pages/SignIn';
import Hero from './pages/student/Hero';
import RootLayout from './layouts/RootLayout';
import Courses from './pages/student/Courses';
import Mylearning from './pages/student/Mylearning';
import Profile from './pages/student/Profile';
import Sidebar from './pages/Sidebar';
import CourseTable from './pages/teacher/course/CourseTable';
import AddCourse from './pages/teacher/course/AddCourse';
import UpdateCourse from './pages/teacher/course/UpdateCourse';
import CreateLecture from './pages/teacher/lecture/CreateLecture';
import EditLecture from './pages/teacher/lecture/EditLecture';
import CourseDetail from './pages/student/CourseDetail';
import CourseProgress from './pages/student/CourseProgress';
import SearchPage from './pages/student/SearchPage';
import { AdminRoute, AuthenticatedUser, ProtectedRoute, TeacherRoute } from './components/ProtectedRoutes';
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';
import EditQuiz from './pages/teacher/lecture/EditQuiz';
import InstructorMessages from './pages/teacher/messages/InstructorMessages';
import LiveClass from './pages/teacher/course/LiveClass';
import MeetingRoom from './pages/teacher/course/MeetingRoom';
import DiscussionPage from "./pages/discussion/DiscussionPage";
import DiscussionTopicDetail from "./pages/Discussion/DiscussionDetailPage";
import NewDiscussionPage from "./pages/discussion/NewDiscussionPage";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DiscussionDetailPage from './pages/Discussion/DiscussionDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminLiveMeetings from './pages/admin/AdminLiveMeetings';
import AdminSidebar from './pages/AdminSidebar';
import AdminRedirect from './components/ProtectedRoutes';

function App() {
  const appRouter = createBrowserRouter([
    // Root layout for student and general pages
    {
      path: "/",
      element:
        // <ProtectedRoute>
          <RootLayout />,
        // </ProtectedRoute>,
      children: [
        {
          index: true,
          element: (
            // <ProtectedRoute>
            <AdminRedirect>
            <>
              <Hero />
              <Courses />
            </>
            </AdminRedirect>
            // {/* </ProtectedRoute> */}
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
            <AdminRedirect>
            <ProtectedRoute>
              <Mylearning />
            </ProtectedRoute>
            </AdminRedirect>
          ),
        },
        {
          path: "profile",
          element: (
            <AdminRedirect>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
            </AdminRedirect>
          ),
        },
        {
         
          path: "course/search",
          element: (
             <AdminRedirect>
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
            </AdminRedirect>
          ),
        },
        {
          path: "course-detail/:courseId",
          element: (
            <AdminRedirect>
      <ProtectedRoute>
        <CourseDetail />
      </ProtectedRoute>
    </AdminRedirect>
          ),
        },
        {
          path: "course-progress/:courseId",
          element: (
            <AdminRedirect>
      <ProtectedRoute>
        <PurchaseCourseProtectedRoute>
          <CourseProgress />
        </PurchaseCourseProtectedRoute>
      </ProtectedRoute>
    </AdminRedirect>
          ),
        },
        {
          path: "/discussion",
          element:
           <AdminRedirect>
      <DiscussionPage />
    </AdminRedirect>,
        },
        {
          path:"/discussion/new",
          element: 
          <AdminRedirect>
      <NewDiscussionPage />
    </AdminRedirect>,
        },
        {
          path:"/discussion/:id",
          element: 
         <AdminRedirect>
      <DiscussionDetailPage />
    </AdminRedirect>,
        },

        // TEACHER routes with sidebar
        {
          path: "teacher",
          element: (
            <ProtectedRoute>
            <TeacherRoute>
              <Sidebar />
            </TeacherRoute>
            </ProtectedRoute>
          ),
          children: [
            { path: "messages", element: <InstructorMessages /> },
            { path: "course", element: <CourseTable /> },
            { path: "course/create", element: <AddCourse /> },
            { path: "course/:courseId", element: <UpdateCourse /> },
            { path: "course/:courseId/lecture", element: <CreateLecture /> },
            { path: "course/:courseId/lecture/:lectureId", element: <EditLecture /> },
            { path: "course/:courseId/quizzes/:quizId", element: <EditQuiz /> },
            { path: "course/live-class/:courseId", element: <LiveClass /> },
          ],
        },
      ],
    },

    
    {
      path: "/teacher/course/meeting-room/:zegoRoomId",
      element: <MeetingRoom />,
    },

    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminRoute>
        <AdminSidebar />
          </AdminRoute>
          
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "users", element: <AdminUsers /> },
        { path: "courses", element: <AdminCourses /> },
        { path: "live-meetings", element: <AdminLiveMeetings /> },
      ],
    },
  ]);

  return (
    <main className="w-full h-full">
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;
