import { Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import useStore from '../store';

export default function Interface() {
  const { isDarkMode, isMuted, toggleDarkMode, toggleMute } = useStore();

  return (
    <div className="fixed bottom-5 right-5 flex gap-3">
      <button
        onClick={toggleMute}
        className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>
      <button
        onClick={toggleDarkMode}
        className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-white" />
        ) : (
          <Moon className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}