import { useState } from 'react';

const REACTIONS = ['💖', '🔥', '👍', '😐'];

function saveFeedback(reaction: string, message: string) {
  try {
    const raw = localStorage.getItem('skysaver-feedback');
    const list = raw ? JSON.parse(raw) : [];
    list.push({ reaction, message, at: new Date().toISOString() });
    localStorage.setItem('skysaver-feedback', JSON.stringify(list));
  } catch {
    // localStorage unavailable — ignore silently
  }
}

export default function FeedbackPopup() {
  const [reaction, setReaction] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (reaction === '' && message.trim().length < 3) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    saveFeedback(reaction, message.trim());
    setSent(true);
  };

  return (
    <div className={`rounded-2xl bg-white/90 backdrop-blur-xl border border-white/70 shadow-xl w-[min(19rem,90vw)] p-4 ${shake ? 'shake-feedback' : ''}`}>
      <div className="mb-3 text-lg font-black text-gray-900 flex items-center gap-1.5">
        <span className="wiggle">📮</span> feedback for the maker
      </div>

      {sent ? (
        <div className="text-center py-2 pop-in">
          <div className="text-4xl mb-1">💌</div>
          <div className="font-black text-gray-900 text-lg">thanks, it's in the post!</div>
          <p className="text-xs font-medium text-gray-500 mt-1">saved on your device — the maker reads hearts ✨</p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setReaction('');
              setMessage('');
            }}
            className="text-xs font-bold text-primary-700 underline mt-2"
          >
            send another
          </button>
        </div>
      ) : (
        <div className="pop-in">
          <div className="space-y-2 mb-2">
            {REACTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReaction(r === reaction ? '' : r)}
                className={`wiggle text-xs font-bold w-full text-left px-3 py-1.5 rounded-lg border transition-all ${
                  r === reaction
                    ? 'bg-primary-100 border-primary-400 text-primary-900 scale-105 shadow'
                    : 'bg-white/80 border-gray-200 text-gray-600'
                }`}
              >
                <span className="mr-1">{r === reaction ? '🔖' : ''}</span>
                <span>{r}</span>
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="tell me what you think…"
            rows={3}
            className="w-full text-sm bg-white/80 border border-gray-200 rounded-lg p-2 outline-none focus:border-primary-400 resize-none"
          />

          <button
            type="button"
            onClick={submit}
            className="mt-2 w-full font-bold text-sm bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-lg py-1.5 hover:from-primary-700 hover:to-accent-600 hover:-translate-y-0.5 active:scale-95 transition-all shadow"
          >
            📮 send it
          </button>
        </div>
      )}
    </div>
  );
}