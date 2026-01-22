import { useUserStore } from "~/stores/user";
import { PUBLIC_ROUTES } from "~/utils/public_routes";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const user = userStore.userName;

  if (PUBLIC_ROUTES.includes(to.path)) {
    return;
  }

  if (!user) {
    return navigateTo("/login");
  }
});
