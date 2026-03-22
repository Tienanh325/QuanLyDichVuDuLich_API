import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import Dashboard from '../pages/Dashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRouter;