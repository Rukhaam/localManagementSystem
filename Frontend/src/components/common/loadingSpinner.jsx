import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  message = "Loading...",
  fullScreen = true,
}) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* 🌟 The sleek spinning icon */}
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />

      {/* Optional pulsing text */}
      {message && (
        <p className="text-gray-500 font-medium text-sm tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  // If fullScreen is true, it takes up the whole page and blurs the background
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/80 backdrop-blur-sm w-full">
        {content}
      </div>
    );
  }

  // Otherwise, it just centers itself inside whatever container you put it in
  return (
    <div className="w-full py-12 flex items-center justify-center">
      {content}
    </div>
  );
}
