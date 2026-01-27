import { Routes, Route } from 'react-router-dom';
import { Dashboard, DataManagement, ResourceAllocation } from './components';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/data-management" element={<DataManagement />} />
      <Route path="/resource-allocation" element={<ResourceAllocation />} />
    </Routes>
  );
}

export default App;
