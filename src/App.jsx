import { Routes, Route } from 'react-router-dom';
import { Dashboard, DataManagement } from './components';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/data-management" element={<DataManagement />} />
    </Routes>
  );
}

export default App;
