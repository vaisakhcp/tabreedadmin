import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminList from './AdminList';
import AdminDetail from './AdminDetail';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={loggedIn ? <AdminList setLoggedIn={setLoggedIn} loggedIn={loggedIn} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/:id"
          element={loggedIn ? <AdminDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<AdminList setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}
        />
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
