import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import ProtectedRoute from './components/ProtectedRoute';

// Feature Components
import LoginPage from './features/auth/LoginPage';
import Dashboard from './features/dashboard/Dashboard';
import ArticleEditor from './features/articles/ArticleEditor';
import ArticleList from './features/articles/ArticleList';
import ApprovalQueue from './features/workflow/ApprovalQueue';
import NewspaperBuilder from './features/newspaper/NewspaperBuilder';
import NewspaperList from './features/newspaper/NewspaperList';
import NewspaperViewer from './features/newspaper/NewspaperViewer';
import OrgSettings from './features/settings/OrgSettings';
import UserManagement from './features/settings/UserManagement';

const App = () => {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/articles/new" element={
              <ProtectedRoute>
                <ArticleEditor />
              </ProtectedRoute>
            } />

            <Route path="/articles" element={
              <ProtectedRoute>
                <ArticleList />
              </ProtectedRoute>
            } />

            <Route path="/articles/edit/:id" element={
              <ProtectedRoute>
                <ArticleEditor />
              </ProtectedRoute>
            } />

            <Route path="/articles/review" element={
              <ProtectedRoute>
                <ApprovalQueue />
              </ProtectedRoute>
            } />

            <Route path="/newspapers" element={
              <ProtectedRoute>
                <NewspaperList />
              </ProtectedRoute>
            } />

            <Route path="/newspapers/new" element={
              <ProtectedRoute>
                <NewspaperBuilder />
              </ProtectedRoute>
            } />

            <Route path="/newspapers/:id" element={
              <ProtectedRoute>
                <NewspaperViewer />
              </ProtectedRoute>
            } />

            <Route path="/settings/org" element={
              <ProtectedRoute>
                <OrgSettings />
              </ProtectedRoute>
            } />

            <Route path="/settings/users" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
};

export default App;
