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
    <div className={`sketch-card paper p-4 w-[min(19rem,90vw)] shadow-2xl ${shake ? 'shake-feedback' : ''}`}>
      <span className="tape absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-16 rotate-1" aria-hidden="true" />

      {sent ? (
        <div className="text-center py-2 pop-in">
          <div className="text-4xl mb-1">💌</div>
          <div className="font-marker font-bold text-gray-900 text-lg">thanks, it's in the post!</div>
          <p className="font-dood text-xs text-gray-500 mt-1">saved on your device — the maker reads hearts ✨</p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setReaction('');
              setMessage('');
            }}
            className="font-dood text-xs font-bold text-primary-700 underline mt-2"
          >
            send another
          </button>
        </div>
      ) : (
        <div className="pop-in">
          <div className="flex items-center gap-1 font-marker font-bold text-gray-900 text-base mb-3">
            <span className="wiggle text-lg">📮</span> feedback for the maker
          </div>

          <div className="space-y-2 mb-2">
            {REACTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReaction(r === reaction ? '' : r)}
                className={`wiggle font-dood text-xs font-bold w-full text-left px-3 py-1.5 rounded-lg border transition-all ${
                  r === reaction
                    ? 'bg-primary-100 border-primary-400 text-primary-900 scale-105 -rotate-1 shadow'
                    : 'bg-white/60 border-gray-900/15 text-gray-600'
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
            placeholder="scribble what you think…"
            rows={3}
            className="w-full font-dood text-sm bg-white/70 border border-gray-900/20 rounded-lg p-2 outline-none focus:border-primary-400 resize-none"
          />

          <button
            type="button"
            onClick={submit}
            className="mt-2 w-full font-marker font-bold text-sm bg-primary-600 text-white rounded-lg py-1.5 hover:bg-primary-700 hover:-rotate-0.5 active:scale-95 transition-all"
          >
            📮 send it
          </button>
        </div>
      )}
    </div>
  );
}