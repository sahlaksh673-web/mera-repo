import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";
import RouteLoader from "@/components/RouteLoader";
import CookieConsentBanner from "./components/CookieConsentBanner";
import ProtectedRoute from "./components/ProtectedRoute";
import PrincipalAudioRoute from "@/components/PrincipalAudioRoute";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Academics = lazy(() => import("./pages/Academics"));
const Facilities = lazy(() => import("./pages/Facilities"));
const Admissions = lazy(() => import("./pages/Admissions"));
const Gallery = lazy(() => import("./pages/Gallery"));
const TopScorers = lazy(() => import("./pages/TopScorers"));
const TopScorersLearnMore = lazy(() => import("./pages/TopScorersLearnMore"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrimaryEducation = lazy(() => import("./pages/PrimaryEducation"));
const SecondaryEducation = lazy(() => import("./pages/SecondaryEducation"));
const HigherSecondary = lazy(() => import("./pages/HigherSecondary"));
const ScienceStream = lazy(() => import("./pages/ScienceStream"));
const CommerceStream = lazy(() => import("./pages/CommerceStream"));
const ArtsStream = lazy(() => import("./pages/ArtsStream"));
const OurTeachers = lazy(() => import("./pages/OurTeachers"));
const TeacherProfile = lazy(() => import("./pages/TeacherProfile"));
const AlumniNetwork = lazy(() => import("./pages/AlumniNetwork"));
const Library = lazy(() => import("./pages/Library"));
const CareerServices = lazy(() => import("./pages/CareerServices"));
const Undergraduate = lazy(() => import("./pages/Undergraduate"));
const Graduate = lazy(() => import("./pages/Graduate"));
const PhdPrograms = lazy(() => import("./pages/PhdPrograms"));
const OnlineLearning = lazy(() => import("./pages/OnlineLearning"));
const PrincipalLogin = lazy(() => import("./pages/PrincipalLogin"));
const PrincipalDashboard = lazy(() => import("./pages/PrincipalDashboard"));
const TeacherLogin = lazy(() => import("./pages/TeacherLogin"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const StudentAuth = lazy(() => import("./pages/StudentAuth"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const StudentNotifications = lazy(() => import("./pages/StudentNotifications"));
const StudentTimetable = lazy(() => import("./pages/StudentTimetable"));
const StudentQuiz = lazy(() => import("./pages/StudentQuiz"));
const StudentMyProfile = lazy(() => import("./pages/StudentMyProfile"));
const StudentAIAssistant = lazy(() => import("./pages/StudentAIAssistant"));
const AuthLanding = lazy(() => import("./pages/AuthLanding"));
const CurriculumGuide = lazy(() => import("./pages/CurriculumGuide"));
const CreateTeacherID = lazy(() => import("./pages/CreateTeacherID"));
const ManageTeacherID = lazy(() => import("./pages/ManageTeacherID"));
const ManageTeachers = lazy(() => import("./pages/ManageTeachers"));
const TeacherProfileSettings = lazy(() => import("./pages/TeacherProfileSettings"));
const StudentProfileSettings = lazy(() => import("./pages/StudentProfileSettings"));
const CoursesManagement = lazy(() => import("./pages/CoursesManagement"));
const Courses = lazy(() => import("./pages/Courses"));
const YearlyBook = lazy(() => import("./pages/YearlyBook"));
const ExamRoutine = lazy(() => import("./pages/ExamRoutine"));
const LazyLoadExample = lazy(() => import("./pages/LazyLoadExample"));
const BusLogin = lazy(() => import("./pages/BusLogin"));
const BusDashboard = lazy(() => import("./pages/BusDashboard"));
const CreateBusID = lazy(() => import("./pages/CreateBusID"));
const ManageBusID = lazy(() => import("./pages/ManageBusID"));
const StudentTrackBus = lazy(() => import("./pages/StudentTrackBus"));

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <About />
            </motion.div>
          } />
          <Route path="/academics" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Academics />
            </motion.div>
          } />
          <Route path="/curriculum-guide" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <CurriculumGuide />
            </motion.div>
          } />
          <Route path="/facilities" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Facilities />
            </motion.div>
          } />
          <Route path="/admissions" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Admissions />
            </motion.div>
          } />
          <Route path="/gallery" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Gallery />
            </motion.div>
          } />
          <Route path="/top-scorers" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <TopScorers />
            </motion.div>
          } />
          <Route path="/top-scorers/learn-more" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <TopScorersLearnMore />
            </motion.div>
          } />
          <Route path="/student/:studentId" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <StudentProfile />
            </motion.div>
          } />
          <Route path="/events" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Events />
            </motion.div>
          } />
          <Route path="/events/:eventId" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <EventDetail />
            </motion.div>
          } />
          <Route path="/yearly-book" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <YearlyBook />
            </motion.div>
          } />
          <Route path="/exam-routine" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <ExamRoutine />
            </motion.div>
          } />
          <Route path="/contact" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Contact />
            </motion.div>
          } />
          <Route path="/privacy" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <PrivacyPolicy />
            </motion.div>
          } />
          <Route path="/terms" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <TermsOfService />
            </motion.div>
          } />
          <Route path="/sitemap" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Sitemap />
            </motion.div>
          } />
          <Route path="/cookies" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <CookiePolicy />
            </motion.div>
          } />
          <Route path="/faq" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <FAQ />
            </motion.div>
          } />
          <Route path="/primary-education" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <PrimaryEducation />
            </motion.div>
          } />
          <Route path="/secondary-education" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <SecondaryEducation />
            </motion.div>
          } />
          <Route path="/higher-secondary" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <HigherSecondary />
            </motion.div>
          } />
          <Route path="/science-stream" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <ScienceStream />
            </motion.div>
          } />
          <Route path="/commerce-stream" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <CommerceStream />
            </motion.div>
          } />
          <Route path="/arts-stream" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <ArtsStream />
            </motion.div>
          } />
          <Route path="/our-teachers" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <OurTeachers />
            </motion.div>
          } />
          <Route path="/teacher/:teacherId" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <TeacherProfile />
            </motion.div>
          } />
          <Route path="/alumni-network" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <AlumniNetwork />
            </motion.div>
          } />
          <Route path="/library" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Library />
            </motion.div>
          } />
          <Route path="/career-services" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <CareerServices />
            </motion.div>
          } />
          <Route path="/undergraduate" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Undergraduate />
            </motion.div>
          } />
          <Route path="/graduate" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Graduate />
            </motion.div>
          } />
          <Route path="/phd-programs" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <PhdPrograms />
            </motion.div>
          } />
          <Route path="/online-learning" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <OnlineLearning />
            </motion.div>
          } />
          <Route path="/principal" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <PrincipalLogin />
            </motion.div>
          } />
          <Route path="/principal-dashboard" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <PrincipalDashboard />
            </motion.div>
          } />
          <Route path="/principal_dashboard" element={<Navigate to="/principal-dashboard" replace />} />
          <Route path="/teacher" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <TeacherLogin />
            </motion.div>
          } />
          <Route path="/auth" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <AuthLanding />
            </motion.div>
          } />
          <Route path="/teacher-dashboard" element={
            <ProtectedRoute
              authKey="teacherAuth"
              redirectTo="/teacher"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <TeacherDashboard />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/teacher-dashbored" element={<Navigate to="/teacher" replace />} />
          <Route path="/teacher-profile-settings" element={
            <ProtectedRoute
              authKey="teacherAuth"
              redirectTo="/teacher"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <TeacherProfileSettings />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/student-login" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <StudentAuth />
            </motion.div>
          } />
          <Route path="/student-dashboard" element={
            <ProtectedRoute
              authKey="studentAuth"
              redirectTo="/student-login"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <StudentDashboard />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/student-notifications" element={
            <ProtectedRoute
              authKey="studentAuth"
              redirectTo="/student-login"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <StudentNotifications />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/student-timetable" element={
            <ProtectedRoute
              authKey="studentAuth"
              redirectTo="/student-login"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <StudentTimetable />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/student-quiz" element={
            <ProtectedRoute requiredRole="student">
              <StudentQuiz />
            </ProtectedRoute>
          } />
          <Route path="/student-my-profile" element={
            <ProtectedRoute
              authKey="studentAuth"
              redirectTo="/student-login"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <StudentMyProfile />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/student-ai-assistant" element={
            <ProtectedRoute
              authKey="studentAuth"
              redirectTo="/student-login"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <StudentAIAssistant />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/student-profile-settings" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <StudentProfileSettings />
            </motion.div>
          } />
          <Route path="/create-teacher-id" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <CreateTeacherID />
            </motion.div>
          } />
          <Route path="/manage-teacher-id" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <ManageTeacherID />
            </motion.div>
          } />
          <Route path="/manage-teachers" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <ManageTeachers />
            </motion.div>
          } />
          <Route path="/courses" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <Courses />
            </motion.div>
          } />
          <Route path="/courses-management" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <CoursesManagement />
            </motion.div>
          } />
          <Route
            path="/principal-audio"
            element={
              <PrincipalAudioRoute />
            }
          />
          <Route path="/lazy-example" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <LazyLoadExample />
            </motion.div>
          } />
          <Route path="/buses" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <BusLogin />
            </motion.div>
          } />
          <Route path="/bus-dashboard" element={
            <ProtectedRoute requiredRole="bus">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <BusDashboard />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/create-bus-id" element={
            <ProtectedRoute requiredRole="principal">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <CreateBusID />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/manage-bus-id" element={
            <ProtectedRoute requiredRole="principal">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <ManageBusID />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/student-track-bus" element={
            <ProtectedRoute requiredRole="student">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <StudentTrackBus />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/student-auth" element={<Navigate to="/student-login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AnimatedRoutes />
            <Toaster />
            <Sonner />
            <CookieConsentBanner />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
