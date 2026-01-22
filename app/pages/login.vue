<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

let username = ref("");
let password = ref("");

const handleLogin = () => {
  if (username.value && password.value) {
    userStore.setUserName(username.value);
    router.push("/");
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen items-center justify-center">
    <h2 class="h2">Login</h2>
    <form @submit.prevent="handleLogin" class="flex flex-col items-center">
      <input
        v-model="username"
        placeholder="Enter your username"
        class="mt-4 px-4 py-2 border rounded-full"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Enter your password"
        class="mt-4 px-4 py-2 border rounded-full"
      />
      <button
        type="submit"
        class="bg-green-800 py-2 px-6 rounded-full btn btn-primary mt-4"
      >
        Login
      </button>
    </form>
  </div>
</template>
