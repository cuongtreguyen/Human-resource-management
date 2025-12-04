import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes';
import { TaskProvider } from './context/TaskContext';
import { OTProvider } from './context/OTContext';
import { KanbanProvider } from './context/KanbanContext';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <OTProvider>
          <KanbanProvider>
            <AppRoutes />
          </KanbanProvider>
        </OTProvider>
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;

