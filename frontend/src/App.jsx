import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, HeartPulse, ShieldAlert, TrendingUp } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import Symptoms from './pages/Symptoms';
import Medications from './pages/Medications';
import Appointments from './pages/Appointments';
import Recovery from './pages/Recovery';
import NurseDashboard from './pages/NurseDashboard';
import PatientDetails from './pages/PatientDetails';
import Alerts from './pages/Alerts';
import api from './services/api';

function App() {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem('carebridge-auth') || 'null'));
  const [language, setLanguage] = useState(() => localStorage.getItem('carebridge-lang') || 'en');
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsRes, alertsRes, statsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/alerts'),
          api.get('/dashboard/stats'),
        ]);
        setPatients(patientsRes.data);
        setAlerts(alertsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (auth) {
      loadData();
    }
  }, [auth]);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('carebridge-auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('carebridge-auth');
    }
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('carebridge-lang', language);
  }, [language]);

  const handleLogin = async (credentials) => {
    const result = await api.post('/login', credentials);
    setAuth({ ...result.data, email: credentials.email });
    navigate(result.data.role === 'PATIENT' ? '/patient' : '/nurse');
  };

  const handleLogout = () => {
    setAuth(null);
    navigate('/');
  };

  const dashboardStats = useMemo(
    () => [
      { title: 'Total Patients', value: stats?.total_patients || 0, icon: HeartPulse, accent: 'teal' },
      { title: 'High Priority', value: stats?.high_risk_patients || 0, icon: ShieldAlert, accent: 'red' },
      { title: 'Monitoring', value: stats?.medium_risk_patients || 0, icon: Bell, accent: 'amber' },
      { title: 'Stable', value: stats?.low_risk_patients || 0, icon: TrendingUp, accent: 'emerald' },
    ],
    [stats]
  );

  if (!auth) {
    return <Login onLogin={handleLogin} language={language} setLanguage={setLanguage} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-800">
      <Navbar
        user={{ name: auth.role === 'PATIENT' ? 'Ravi Kumar' : 'Nurse Admin' }}
        onLogout={handleLogout}
        roleLabel={
          auth.role === 'PATIENT'
            ? (language === 'hi' ? 'मरीज पोर्टल' : language === 'ml' ? 'പേഷന്റ് പോർച്ചൽ' : language === 'ta' ? 'நோயாளி போர்டல்' : 'Patient Portal')
            : (language === 'hi' ? 'क्लिनिकल डैशबोर्ड' : language === 'ml' ? 'ക്ലിനിക്കൽ ഡാഷ്ബോർഡ്' : language === 'ta' ? 'கிளினிக்கல் டாஷ்போர்டு' : 'Clinical Dashboard')
        }
        language={language}
        setLanguage={setLanguage}
      />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar role={auth.role} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to={auth.role === 'PATIENT' ? '/patient' : '/nurse'} replace />} />
            <Route
              path="/patient"
              element={<PatientDashboard patientId={auth.patient_id || 1} stats={dashboardStats} language={language} />} 
            />
            <Route path="/patient/symptoms" element={<Symptoms patientId={auth.patient_id || 1} />} />
            <Route path="/patient/medications" element={<Medications patientId={auth.patient_id || 1} />} />
            <Route path="/patient/appointments" element={<Appointments patientId={auth.patient_id || 1} />} />
            <Route path="/patient/recovery" element={<Recovery patientId={auth.patient_id || 1} />} />
            <Route
              path="/nurse"
              element={<NurseDashboard patients={patients} alerts={alerts} stats={dashboardStats} />} 
            />
            <Route path="/patients/:patientId" element={<PatientDetails />} />
            <Route path="/alerts" element={<Alerts alerts={alerts} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
