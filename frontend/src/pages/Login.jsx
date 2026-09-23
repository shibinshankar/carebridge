import { useState } from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export default function Login({ onLogin, language, setLanguage }) {
  const labels = {
    en: {
      welcome: 'Welcome back',
      title: 'Sign in to CareBridge',
      email: 'Email',
      password: 'Password',
      continue: 'Continue',
      signing: 'Signing in...',
      demo: 'Demo credentials',
      patient: 'Patient',
      nurse: 'Nurse',
      auth: 'Demo auth',
      access: 'Patient & Nurse Access',
      item1: '30-day recovery monitoring',
      item2: 'Deterministic warning-sign alerts',
      item3: 'Clinical review workflow',
      unable: 'Unable to login.',
      platform: 'Hospital-to-Home Recovery Platform'
    },
    hi: {
      welcome: 'फिर से स्वागत है',
      title: 'CareBridge में साइन इन करें',
      email: 'ईमेल',
      password: 'पासवर्ड',
      continue: 'जारी रखें',
      signing: 'लॉगिन हो रहा है...',
      demo: 'डेमो क्रेडेंशियल',
      patient: 'मरीज',
      nurse: 'नर्स',
      auth: 'डेमो प्रमाणीकरण',
      access: 'मरीज और नर्स एक्सेस',
      item1: '30-दिवसीय रिकवरी निगरानी',
      item2: 'निर्धारित चेतावनी संकेत अलर्ट',
      item3: 'क्लिनिकल रिव्यू वर्कफ़्लो',
      unable: 'लॉगिन नहीं हो सका.',
      platform: 'अस्पताल से घर तक रिकवरी प्लेटफ़ॉर्म'
    },
    ml: {
      welcome: 'വീണ്ടും സ്വാഗതം',
      title: 'CareBridge-ൽ സൈൻ ഇൻ ചെയ്യുക',
      email: 'ഇമെയിൽ',
      password: 'പാസ്വേഡ്',
      continue: 'തുടരുക',
      signing: 'ലോഗിൻ ചെയ്യുന്നു...',
      demo: 'ഡെമോ ക്രെഡൻഷ്യലുകൾ',
      patient: 'പാപ്',
      nurse: 'നഴ്സ്',
      auth: 'ഡെമോ ഓതെന്റിക്കേഷൻ',
      access: 'രോഗി, നഴ്സ് ആക്സസ്',
      item1: '30-ദിവസ recover ഡയറിയൻട്രോണമെന്റ്',
      item2: 'നിർണ്ണയിച്ച മുന്നറിയിപ്പ് അലെർട്ടുകൾ',
      item3: 'ക്ലിനിക്കൽ റിവ്യൂ വർക്ക്ഫ്ലോ',
      unable: 'ലോഗിൻ ചെയ്യാനായില്ല.',
      platform: 'അപ്പാർട്ട്മെന്റിൽ നിന്ന് വീട്ടിലേക്കുള്ള വീണ്ടെടുക്കൽ പ്ലാറ്റ്ഫോം'
    },
    ta: {
      welcome: 'மீண்டும் வருக',
      title: 'CareBridge-இல் உள்நுழைக',
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      continue: 'தொடரவும்',
      signing: 'உள்நுழைகிறோம்...',
      demo: 'டெமோ சான்றுகள்',
      patient: 'நோயாளி',
      nurse: 'நர்ச்',
      auth: 'டெமோ அங்கீகாரம்',
      access: 'நோயாளர் & நர்ச் அணுகல்',
      item1: '30 நாள் மீட்பு கண்காணிப்பு',
      item2: 'நிர்ணயிக்கப்பட்ட எச்சரிக்கை அட்டை',
      item3: 'மருத்துவ மதிப்பாய்வு பணிப்பாய்வு',
      unable: 'உள்நுழைய முடியவில்லை.',
      platform: 'மருத்துவமனையில் இருந்து வீட்டுக்கு மீட்பு தளம்'
    }
  };
  const t = labels[language] || labels.en;

  const [email, setEmail] = useState('patient@demo.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin({ email, password });
    } catch (err) {
      setError(err.message || t.unable);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft">
        <div className="grid lg:grid-cols-2">
          <div className="bg-gradient-to-br from-primary to-secondary p-8 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-bold">CareBridge</p>
                  <p className="text-sm text-white/80">{t.platform}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                {['en', 'hi', 'ml', 'ta'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${language === lang ? 'bg-white text-slate-900' : 'text-white/80'}`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : lang === 'ml' ? 'മ' : 'த'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 space-y-5">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-wide text-white/70">{t.auth}</p>
                <p className="mt-2 text-3xl font-bold">{t.access}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                  <Activity className="h-5 w-5" />
                  <span>{t.item1}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                  <Activity className="h-5 w-5" />
                  <span>{t.item2}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                  <Activity className="h-5 w-5" />
                  <span>{t.item3}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">{t.welcome}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{t.title}</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">{t.email}</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-primary focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">{t.password}</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-primary focus:bg-white"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white transition hover:bg-teal-700 disabled:bg-slate-300"
              >
                {loading ? t.signing : t.continue}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">{t.demo}</p>
              <div className="mt-2 grid gap-2">
                <p>{t.patient}: patient@demo.com / password123</p>
                <p>{t.nurse}: nurse@demo.com / password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
