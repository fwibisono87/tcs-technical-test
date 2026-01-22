<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const user = computed(() => userStore.userName);
</script>

<template>
  <div class="flex flex-col min-h-screen items-center justify-center">
    <h1 class="h1">StackUnderflow</h1>
    <span>Home to all the questions you never asked ^^!</span>
    <span v-if="user" class="mt-4">
      Welcome back, <strong>{{ user }}</strong
      >!
    </span>
    <button
      v-if="!user"
      class="bg-orange-800 cursor-pointer py-2 px-6 rounded-full btn btn-primary mt-4"
      @click="$router.push('/login')"
    >
      Login
    </button>
    <button
      v-else
      class="bg-green-800 py-2 px-6 cursor-pointer rounded-full btn btn-primary mt-4"
      @click="$router.push('/questions')"
    >
      View Questions
    </button>
  </div>
</template>
