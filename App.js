import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TextEditor from "./Editor";
import { v4 as uuidV4 } from "uuid";
import {useAuth} from './AuthProvider';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/docs/${uuidV4()}`} />} />
        <Route path="/docs/:id" element={<TextEditor />} />
        <Route path="/docs/:id" element={<ProtectedRoute><TextEditor /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
