import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import AuthorsPage from './pages/AuthorsPage';
import AuthorDetailPage from './pages/AuthorDetailPage';
import TagsPage from './pages/TagsPage';
import TagDetailPage from './pages/TagDetailPage';
import AdminPage from './pages/AdminPage';
import ManagePostsPage from './pages/ManagePostsPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:slug" element={<PostDetailPage />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/authors/:author" element={<AuthorDetailPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/tags/:tag" element={<TagDetailPage />} />
            
            {/* Content Creation */}
            <Route path="/create" element={<CreatePostPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/posts" element={<ManagePostsPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            
            {/* Placeholder routes for future implementation */}
            <Route path="/about" element={
              <div className="container py-16 text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">About Us</h1>
                <p className="text-secondary mb-6">Learn more about our blog platform and mission.</p>
              </div>
            } />
            
            <Route path="/contact" element={
              <div className="container py-16 text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
                <p className="text-secondary mb-6">Get in touch with our team.</p>
              </div>
            } />
            
            <Route path="/privacy" element={
              <div className="container py-16 text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">Privacy Policy</h1>
                <p className="text-secondary mb-6">How we handle your data and privacy.</p>
              </div>
            } />
            
            <Route path="/terms" element={
              <div className="container py-16 text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">Terms of Service</h1>
                <p className="text-secondary mb-6">Terms and conditions for using our platform.</p>
              </div>
            } />
            
            {/* 404 */}
            <Route path="*" element={
              <div className="container py-16 text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
                <p className="text-secondary mb-6">Page not found</p>
                <a href="/" className="text-primary hover:underline">Go back home</a>
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;