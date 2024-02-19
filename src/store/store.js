import { create } from "zustand";

const useUserInputStore = create((set) => ({
  userInput: "",
  setUserInput: (userInput) => set({ userInput }),
}));

const useCheckSpellStore = create((set) => ({
  shouldCheckSpell: true,
  setShouldCheckSpell: (shouldCheckSpell) => set({ shouldCheckSpell }),
}));

const useUserStore = create((set) => ({
  isLoggedIn: false,
  user: {},
  setIsLoggedIn: (isLoggedIn) =>
    set({
      isLoggedIn,
    }),
  setUser: (user) => set({ user }),
}));

const useHeaderStateStore = create((set) => ({
  headerState: "MainPage",
  setHeaderState: (headerState) => set({ headerState }),
}));

const usePlayerDimensions = create((set) => ({
  playerDimensions: { width: "100%", height: "100%" },
  setPlayerDimensions: (playerDimensions) => set({ playerDimensions }),
}));

const useAutoCrawlingTimerStore = create((set) => ({
  autoCrawlingTimer: false,
  setAutoCrawlingTimer: (autoCrawlingTimer) => set({ autoCrawlingTimer }),
}));

export {
  useUserInputStore,
  useCheckSpellStore,
  useUserStore,
  useHeaderStateStore,
  usePlayerDimensions,
  useAutoCrawlingTimerStore,
};
