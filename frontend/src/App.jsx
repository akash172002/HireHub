import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import MyApplications from './pages/MyApplications';
import PostJob from './pages/PostJob';
import RecruiterJobs from './pages/RecruiterJobs';
import JobApplications from './pages/JobApplications';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-applications" element={<ProtectedRoute roles={['SEEKER']}><MyApplications /></ProtectedRoute>} />
            <Route path="/recruiter/post" element={<ProtectedRoute roles={['RECRUITER']}><PostJob /></ProtectedRoute>} />
            <Route path="/recruiter/jobs" element={<ProtectedRoute roles={['RECRUITER']}><RecruiterJobs /></ProtectedRoute>} />
            <Route path="/recruiter/jobs/:jobId/applications" element={<ProtectedRoute roles={['RECRUITER']}><JobApplications /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
