import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import PageWrapper from './components/layout/PageWrapper'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import EnrollmentPage from './pages/EnrollmentPage'
import CoursesPage from './pages/CoursesPage'
import PaymentsPage from './pages/PaymentsPage'
import CashPage from './pages/CashPage'
import ReportsPage from './pages/ReportsPage'

function App() {
  // Para desarrollo, mostrar la aplicación directamente sin autenticación
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <PageWrapper>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/enrollment" element={<EnrollmentPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/cash" element={<CashPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </PageWrapper>
        </main>
      </div>
    </div>
  )
}

export default App