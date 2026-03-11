export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo / Icon */}
        <div className="relative">
          <div className="w-16 h-16 bg-blue-600 flex items-center justify-center shadow-xl">
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          {/* Rings */}
          <div className="absolute inset-0 -m-2 border-2 border-blue-400/40 animate-ping" />
          <div
            className="absolute inset-0 -m-4 border border-blue-300/20 animate-ping"
            style={{ animationDelay: '0.3s' }}
          />
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-blue-100 overflow-hidden">
          <div className="h-full bg-blue-600 animate-shimmer" />
        </div>

        {/* Text + dots */}
        <div className="flex items-center gap-2">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Memuat
          </p>
          <div className="flex gap-1">
            {[0, 0.2, 0.4].map((delay, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
