import { create } from "zustand";

const useUserInputStore = create((set) => ({
  userInput: "",
  setUserInput: (userInput) => set({ userInput }),
}));

export default useUserInputStore;
