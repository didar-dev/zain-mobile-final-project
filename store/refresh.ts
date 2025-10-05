import { create } from "zustand";

export const userefresh = create((set) => ({
  HP_refresher: 1,
  HP_Trigger: () =>
    set((state: any) => ({ HP_refresher: state.HP_refresher + 1 })),
}));
