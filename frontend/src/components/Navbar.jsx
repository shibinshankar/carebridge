import { Activity, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ user, onLogout, roleLabel, language, setLanguage }) {
  const displayText = {
    en: 'Hospital-to-Home Recovery',
    hi: 'अस्पताल से घर तक रिकवरी',
    ml: 'അപ്പാർട്ട്മെന്റിൽ നിന്ന് വീട്ടിലേക്കുള്ള വീണ്ടെടുക്കൽ',
    ta: 'மருத்துவமனையில் இருந்து வீட்டுக்கு மீட்பு'
  };

  const guestText = {
    en: 'Guest',
    hi: 'अतिथि',
    ml: 'അതിഥി',
    ta: 'விருந்தினர்'
  };

  const demoText = {
    en: 'Demo mode',
    hi: 'डेमो मोड',
    ml: 'ഡെമോ മോഡ്',
    ta: 'டெமோ மோட்'
  };

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">CareBridge</p>
            <p className="text-xs text-slate-500">{displayText[language] || displayText.en}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 sm:flex sm:items-center sm:gap-2">
            <Activity className="h-4 w-4" />
            {roleLabel}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            {['en', 'hi', 'ml', 'ta'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-full px-2 py-1 text-xs font-semibold ${language === lang ? 'bg-white text-slate-900' : 'text-slate-500'}`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : lang === 'ml' ? 'മ' : 'த'}
              </button>
            ))}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">{user?.name || guestText[language] || guestText.en}</p>
            <p className="text-xs text-slate-500">{demoText[language] || demoText.en}</p>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            {language === 'hi' ? 'लॉगआउट' : language === 'ml' ? 'ലോഗ്ഔട്ട്' : language === 'ta' ? 'லாக்அவுட்' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
}
