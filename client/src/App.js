import { cloneElement } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import { Navigate } from 'react-router-dom';
import BaseLogin from './pages/BaseLogin'
import { jwtDecode } from "jwt-decode";
import Categories from "./pages/Categories"
import Themes from "./pages/Themes"
import Content from "./pages/Content"
import ViewContent from "./pages/ViewContent"

function App() {

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded.role
      return <BaseLogin role={role}>{cloneElement(children, { role })}</BaseLogin>;
    } else {
      return <Navigate to="/login" />;
    }
  };

  const LoginRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (token) {
      return <Navigate to="/dashboard" />
    } else {
      return children;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={
          <LoginRoute>
            <Login />
          </LoginRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/categories" element={
          <PrivateRoute>
            <Categories />
          </PrivateRoute>
        } />
        <Route path="/themes" element={
          <PrivateRoute>
            <Themes />
          </PrivateRoute>
        } />
        <Route path="/content" element={
          <PrivateRoute>
            <Content />
          </PrivateRoute>
        } />
        <Route path="/view/content" element={<ViewContent />} />
      </Routes>
    </BrowserRouter>
  ); 
}

export default App;