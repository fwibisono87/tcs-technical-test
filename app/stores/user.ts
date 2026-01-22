import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const userName = ref<string>("");

  const setUserName = (name: string) => {
    userName.value = name;
  };

  const logout = () => {
    userName.value = "";
  };

  return {
    userName,
    setUserName,
    logout,
  };
});
