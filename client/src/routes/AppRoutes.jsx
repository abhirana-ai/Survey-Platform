import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import LandingPage from '../pages/public/LandingPage.jsx';
import LoginPage from '../pages/public/LoginPage.jsx';
import RegisterPage from '../pages/public/RegisterPage.jsx';
import DashboardPage from '../pages/organisation/DashboardPage.jsx';
import SurveysPage from '../pages/organisation/SurveysPage.jsx';
import CreateSurveyPage from '../pages/organisation/CreateSurveyPage.jsx';
import SurveyDetailPage from '../pages/participant/SurveyDetailPage.jsx';
import EditSurveyPage from '../pages/organisation/EditSurveyPage.jsx';
import SurveyResultsPage from '../pages/organisation/SurveyResultsPage.jsx';
import MyResponsesPage from '../pages/participant/MyResponsesPage.jsx';
import NotFoundPage from '../pages/public/NotFoundPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/surveys" element={<SurveysPage />} />
      <Route path="/surveys/create" element={<CreateSurveyPage />} />
      <Route path="/surveys/:id" element={<SurveyDetailPage />} />
      <Route path="/surveys/:id/edit" element={<EditSurveyPage />} />
      <Route path="/surveys/:id/results" element={<SurveyResultsPage />} />
      <Route path="/my-responses" element={<MyResponsesPage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
