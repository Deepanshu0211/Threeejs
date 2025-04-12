import { create } from 'zustand';



interface State {
  isDarkMode: boolean;
  isMuted: boolean;
  isLaptopOpen: boolean;
  currentTime: number;
  initialCameraAnimation: boolean;
  toggleDarkMode: () => void;
  toggleMute: () => void;
  setLaptopOpen: (open: boolean) => void;
  setCurrentTime: (time: number) => void;
  setInitialCameraAnimation: (value: boolean) => void;
}

const useStore = create<State>((set) => ({
  isDarkMode: false,
  isMuted: true,
  isLaptopOpen: false,
  currentTime: 14, // 2 PM default
  initialCameraAnimation: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setLaptopOpen: (value: boolean) => set({ isLaptopOpen: value }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setInitialCameraAnimation: (value) => set({ initialCameraAnimation: value }),
}));

export default useStore;