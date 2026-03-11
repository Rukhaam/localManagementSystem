import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  message = "Loading...",
  fullScreen = true,
}) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />

      {message && (
        <p className="text-gray-500 font-medium text-sm tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/80 backdrop-blur-sm w-full">
        {content} 
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {content}
    </div>
  );
}
