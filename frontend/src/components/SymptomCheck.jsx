import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mic, MicOff, ShieldAlert } from 'lucide-react';

export default function SymptomCheck({ onSubmit, loading = false }) {
  const [mood, setMood] = useState('Good');
  const [painLevel, setPainLevel] = useState(3);
  const [medicationTaken, setMedicationTaken] = useState('Yes');
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);

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
      let transcript = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript?.trim() || '';
        if (text) {
          transcript += `${text} `;
        }
      }

      const finalText = transcript.trim();
      if (!finalText) {
        return;
      }

      setMessage((prev) => {
        const cleanedPrev = prev.trim();
        return cleanedPrev ? `${cleanedPrev} ${finalText}` : finalText;
      });
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      listeningRef.current = false;
      setIsListening(false);
    };
    recognition.onend = () => {
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch (error) {
          console.warn('Speech recognition restart failed:', error);
        }
        return;
      }

      setIsListening(false);
    };
    recognitionRef.current = recognition;

    return () => {
      listeningRef.current = false;
      recognition.stop();
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, []);

  const handleVoiceToggle = () => {
    const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSupported) {
      window.alert('Voice input is not supported in this browser. Please use Chrome or Edge on localhost.');
      return;
    }

    if (!recognitionRef.current) {
      return;
    }

    if (isListening) {
      listeningRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    listeningRef.current = true;

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.warn('Speech recognition already started:', error);
      listeningRef.current = false;
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ mood, painLevel, medicationTaken, symptomMessage: message });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Daily Check-in</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">How are you feeling today?</h3>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Mood</label>
        <div className="grid grid-cols-3 gap-3">
          {['Good', 'Okay', 'Not well'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMood(option)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                mood === option
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Pain level: {painLevel}/10</label>
        <input
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={(e) => setPainLevel(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Did you take today's medications?</label>
        <div className="grid grid-cols-3 gap-3">
          {['Yes', 'No', 'Partially'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMedicationTaken(option)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                medicationTaken === option
                  ? 'border-secondary bg-secondary text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="symptomMessage" className="block text-sm font-medium text-slate-700">
            Tell us anything that feels different today.
          </label>
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              isListening
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary'
            }`}
          >
            {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            {isListening ? 'Stop voice' : 'Voice message'}
          </button>
        </div>
        <textarea
          id="symptomMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="e.g. I’m feeling more tired today and I’m having increasing difficulty breathing."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none transition focus:border-primary focus:bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? 'Submitting...' : 'Complete Check-in'}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <div className="flex items-start gap-2">
          <ShieldAlert className="mt-0.5 h-4 w-4" />
          <p>
            CareBridge does not replace professional medical care. For urgent symptoms, seek appropriate emergency or professional care according to your healthcare team's instructions.
          </p>
        </div>
      </div>
    </form>
  );
}
