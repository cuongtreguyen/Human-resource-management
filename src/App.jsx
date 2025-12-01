import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes';
import { TaskProvider } from './context/TaskContext';
import { OTProvider } from './context/OTContext';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <OTProvider>
          <AppRoutes />
        </OTProvider>
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;

