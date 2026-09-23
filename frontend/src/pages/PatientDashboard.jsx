import { Bell, CalendarDays, CircleCheckBig, HeartPulse, ShieldAlert, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import MedicationCard from '../components/MedicationCard';
import AppointmentCard from '../components/AppointmentCard';
import RiskBadge from '../components/RiskBadge';
import RecoveryTimeline from '../components/RecoveryTimeline';
import StatCard from '../components/StatCard';

const safeStatus = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export default function PatientDashboard({ patientId, stats, language = 'en' }) {
  const strings = {
    en: {
      goodMorning: 'Good morning',
      recoveryStatus: 'Recovery Status',
      currentStatus: 'Current status',
      stable: 'STABLE',
      recoveryProgress: 'Recovery progress',
      todaysCare: "Today's Care",
      adherence: 'adherence',
      nextAppointment: 'Next Appointment',
      noAppointment: 'No upcoming appointment',
      latestCheckIn: 'Latest check-in',
      mood: 'Mood',
      pain: 'Pain',
      medication: 'Medication',
      complete: 'Complete Daily Check-in',
      highPriority: 'HIGH PRIORITY',
      hospitalMessage: 'Potential warning sign detected. Please seek appropriate professional medical attention according to your healthcare team’s instructions. CareBridge does not diagnose medical conditions.',
      contact: 'Contact Care Team',
      whatsapp: 'WhatsApp Care Team',
      voiceAlert: 'Voice Alert',
      listening: 'Listening…',
      viewDetails: 'View details',
      markTaken: 'Mark as Taken',
      taken: 'Taken',
      yes: 'Yes',
      no: 'No',
      priority: 'PRIORITY'
    },
    hi: {
      goodMorning: 'शुभ प्रभात',
      recoveryStatus: 'रिकवरी स्थिति',
      currentStatus: 'वर्तमान स्थिति',
      stable: 'स्थिर',
      recoveryProgress: 'रिकवरी प्रगति',
      todaysCare: 'आज की देखभाल',
      adherence: 'पालन',
      nextAppointment: 'अगला अपॉइंटमेंट',
      noAppointment: 'कोई आगामी अपॉइंटमेंट नहीं',
      latestCheckIn: 'नवीनतम चेक-इन',
      mood: 'मूड',
      pain: 'दर्द',
      medication: 'दवा',
      complete: 'दैनिक चेक-इन पूरा करें',
      highPriority: 'उच्च प्राथमिकता',
      hospitalMessage: 'संभावित चेतावनी संकेत मिला है। कृपया अपने स्वास्थ्य टीम के निर्देशों के अनुसार उचित पेशेवर चिकित्सा सहायता लें। CareBridge चिकित्सा निदान नहीं करता है।',
      contact: 'केयर टीम से संपर्क करें',
      whatsapp: 'व्हाट्सऐप केयर टीम',
      voiceAlert: 'वॉइस अलर्ट',
      listening: 'सुन रहा है…',
      viewDetails: 'विवरण देखें',
      markTaken: 'ले लिया चिह्नित करें',
      taken: 'ले लिया',
      yes: 'हाँ',
      no: 'नहीं',
      priority: 'प्राथमिकता'
    },
    ml: {
      goodMorning: 'സുഹൃത്തായിരിക്കുക',
      recoveryStatus: 'വീണ്ടെടുക്കൽ നില',
      currentStatus: 'നിലവിലുള്ള നില',
      stable: 'സ്ഥിരം',
      recoveryProgress: 'വീണ്ടെടുക്കൽ പുരോഗതി',
      todaysCare: 'ഇന്നത്തെ പരിചരണം',
      adherence: 'പാലനം',
      nextAppointment: 'അടുത്ത встречи',
      noAppointment: 'അടുത്ത встречയില്ല',
      latestCheckIn: 'പുതിയ ചെക്ക്-ഇൻ',
      mood: 'മുഡ്',
      pain: 'വേദന',
      medication: 'മരുന്ന്',
      complete: 'ദിവസേന ചെക്ക്-ഇൻ പൂർത്തിയാക്കുക',
      highPriority: 'ഉയർന്ന മുൻഗണന',
      hospitalMessage: 'സാധ്യതയുള്ള മുന്നറിയിപ്പ് അടയാളം കണ്ടെത്തി. നിങ്ങളുടെ ആരോഗ്യവ്യാപ്തlüğിന്റെ നിർദ്ദേശങ്ങൾക്കനുസരിച്ച് ഉചിതമായ പ്രൊഫഷണൽ മെഡിക്കൽ സഹായം തേടുക. CareBridge വൈദ്യശാസ്ത്രപരമായി രോഗം നിർണ്ണയിക്കുന്നില്ല.',
      contact: 'കെയർ ടീം ബന്ധപ്പെടുക',
      whatsapp: 'വാട്ട്സ്ആപ്പ് കെയർ ടീം',
      voiceAlert: 'വോയ്‌സ് അലേർട്ട്',
      listening: 'കേൾക്കുന്നു…',
      viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
      markTaken: 'എടുത്തു എന്ന് അടയാളപ്പെടുത്തുക',
      taken: 'എടുത്തു',
      yes: 'അവൾ',
      no: 'ഇല്ല',
      priority: 'മുൻഗണന'
    },
    ta: {
      goodMorning: 'காலை வணக்கம்',
      recoveryStatus: 'மீட்பு நிலை',
      currentStatus: 'தற்போதைய நிலை',
      stable: 'நிலையானது',
      recoveryProgress: 'மீட்பு முன்னேற்றம்',
      todaysCare: 'இன்றைய பராமரிப்பு',
      adherence: 'பின்பற்றல்',
      nextAppointment: 'அடுத்த சந்திப்பு',
      noAppointment: 'எந்த அடுத்த சந்திப்பும் இல்லை',
      latestCheckIn: 'சமீபத்திய செக்-இன்',
      mood: 'மூட்',
      pain: 'வலி',
      medication: 'மருந்து',
      complete: 'முன்னேற்றத்தை முடிக்கவும்',
      highPriority: 'அதிக முன்னுரிமை',
      hospitalMessage: 'சாத்தியமான எச்சரிக்கை அறிகுறி கண்டறியப்பட்டது. உங்கள் சுகாதாரக் குழுவின் வழிமுறைகளின்படி பொருத்தமான தொழில்முறை மருத்துவ உதவியை நாடுங்கள். CareBridge மருத்துவத்தை கண்டறிவதில்லை.',
      contact: 'கேர் டீம் தொடர்பு கொள்ளவும்',
      whatsapp: 'வாட்ஸ்அப் கேர் டீம்',
      voiceAlert: 'வாய்ஸ் அலர்ட்',
      listening: 'கேட்கிறது…',
      viewDetails: 'விவரங்களைப் பார்க்க',
      markTaken: 'எடுக்கப்பட்டது என குறிக்கவும்',
      taken: 'எடுக்கப்பட்டது',
      yes: 'ஆம்',
      no: 'இல்லை',
      priority: 'முன்னுரிமை'
    }
  };
  const t = strings[language] || strings.en;
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVoiceAlertListening, setIsVoiceAlertListening] = useState(false);
  const voiceAlertRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientRes, medsRes, appointmentsRes] = await Promise.all([
          api.get(`/patients/${patientId}`),
          api.get(`/patients/${patientId}/medications`),
          api.get(`/patients/${patientId}/appointments`),
        ]);

        setPatient(patientRes.data);
        setMedications(medsRes.data);
        setAppointments(appointmentsRes.data);
      } catch (err) {
        setError(err.message || 'Unable to load data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId]);

  const handleMarkTaken = async (medicationId) => {
    try {
      await api.post(`/medications/${medicationId}/taken`);
      setMedications((current) => current.map((med) => (med.id === medicationId ? { ...med, status: 'TAKEN' } : med)));
    } catch (err) {
      setError(err.message || 'Unable to update medication status.');
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
        .trim();

      const message = transcript || 'Your patient is in critical condition. Please assist immediately.';
      const url = `https://wa.me/919292008729?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      setIsVoiceAlertListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Emergency speech recognition error:', event.error);
      setIsVoiceAlertListening(false);
    };
    recognition.onend = () => setIsVoiceAlertListening(false);
    voiceAlertRef.current = recognition;

    return () => {
      recognition.stop();
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, []);

  const handleVoiceEmergencyAlert = () => {
    const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSupported) {
      window.alert('Voice input is not supported in this browser. Please use Chrome or Edge on localhost.');
      return;
    }

    if (!voiceAlertRef.current) {
      return;
    }

    if (isVoiceAlertListening) {
      voiceAlertRef.current.stop();
      setIsVoiceAlertListening(false);
      return;
    }

    try {
      voiceAlertRef.current.start();
      setIsVoiceAlertListening(true);
    } catch (error) {
      console.warn('Emergency speech recognition already started:', error);
      setIsVoiceAlertListening(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>;
  }

  const nextAppointment = appointments[0];
  const todaysMeds = medications.filter((med) => med.status !== 'TAKEN').slice(0, 3);
  const adherence = medications.length
    ? Math.round((medications.filter((med) => med.status === 'TAKEN').length / medications.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-white/80">CareBridge</p>
            <h1 className="mt-2 text-3xl font-bold">{t.goodMorning}, {patient?.name?.split(' ')[0]} 👋</h1>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 text-sm backdrop-blur-sm">
            <p>Day {8} / 30</p>
            <p className="mt-1 text-lg font-semibold">Recovery progress</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} icon={item.icon} accent={item.accent} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-primary">{t.recoveryStatus}</p>
                <div className="mt-2 flex items-center gap-3">
                  <RiskBadge level={safeStatus[patient?.risk_level || 'LOW']} />
                  <span className="text-xl font-bold text-slate-900">{patient?.risk_level || 'LOW'} {t.priority}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">{t.currentStatus}</p>
                <p className="text-lg font-semibold text-slate-800">{t.stable}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm text-slate-500">
                <span>{t.recoveryProgress}</span>
                <span>40%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-40 rounded-full bg-gradient-to-r from-primary to-secondary" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{t.todaysCare}</h2>
              <div className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-primary">{adherence}% {t.adherence}</div>
            </div>
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${med.status === 'TAKEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {med.status === 'TAKEN' ? <CircleCheckBig className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{med.medicine_name}</p>
                      <p className="text-xs text-slate-500">{med.scheduled_time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkTaken(med.id)}
                    disabled={med.status === 'TAKEN'}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {med.status === 'TAKEN' ? t.taken : t.markTaken}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <RecoveryTimeline currentDay={8} patientName={patient?.name || 'Patient'} />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">{t.nextAppointment}</p>
            {nextAppointment ? (
              <>
                <p className="mt-3 text-2xl font-bold text-slate-900">
                  {new Date(nextAppointment.appointment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </p>
                <p className="mt-1 text-lg text-slate-600">{nextAppointment.department}</p>
                <Link
                  to="/patient/appointments"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-secondary"
                >
                  <CalendarDays className="h-4 w-4" />
                  {t.viewDetails}
                </Link>
              </>
            ) : (
              <p className="mt-3 text-slate-500">{t.noAppointment}</p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              <p className="text-xl font-bold text-slate-900">{t.latestCheckIn}</p>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">{t.mood}:</span> Good</p>
              <p><span className="font-semibold text-slate-800">{t.pain}:</span> 3/10</p>
              <p><span className="font-semibold text-slate-800">{t.medication}:</span> {t.yes}</p>
            </div>
            <Link to="/patient/symptoms" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white">
              {t.complete}
            </Link>
          </div>

          {patient?.risk_level === 'HIGH' && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-1 h-5 w-5 text-red-600" />
                <div>
                  <p className="text-lg font-bold text-red-700">{t.highPriority}</p>
                  <p className="mt-2 text-sm text-red-700">
                    {t.hospitalMessage}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => window.location.href = 'tel:+919292008729'}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white"
                    >
                      {t.contact}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open('https://wa.me/919292008729?text=Your%20patient%20is%20in%20critical%20condition.%20Please%20assist%20immediately.', '_blank')}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700"
                    >
                      {t.whatsapp}
                    </button>
                    <button
                      type="button"
                      onClick={handleVoiceEmergencyAlert}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                        isVoiceAlertListening
                          ? 'border-red-300 bg-red-100 text-red-700'
                          : 'border-red-200 bg-white text-red-700'
                      }`}
                    >
                      {isVoiceAlertListening ? t.listening : t.voiceAlert}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
