import { create } from "zustand";

const useUserInputStore = create((set) => ({
  userInput: "",
  setUserInput: (userInput) => set({ userInput }),
}));

const useVideoStore = create((set) => ({
  videos: [],
  setVideos: (data) => set((state) => ({ videos: data })),
  insertVideos: (data) =>
    set((state) => ({ videos: state.videos.concat(data) })),
}));

export { useUserInputStore, useVideoStore };
