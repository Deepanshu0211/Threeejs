import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
       
        <div className="absolute w-32 h-32 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
        
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Loading Portfolio</h2>
          <p className="text-purple-300 text-sm">Preparing your experience...</p>
        </div>
      </div>
    </div>
  );
}