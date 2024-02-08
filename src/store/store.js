import { create } from "zustand";

const useUserInputStore = create((set) => ({
  userInput: "",
  setUserInput: (userInput) => set({ userInput }),
}));

const useCheckSpellStore = create((set) => ({
  shouldCheckSpell: true,
  setShouldCheckSpell: (shouldCheckSpell) => set({ shouldCheckSpell }),
}));

export { useUserInputStore, useCheckSpellStore };
