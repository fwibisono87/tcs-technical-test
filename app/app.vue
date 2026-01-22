<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useUserStore } from "~/stores/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

let user = computed(() => userStore.userName);

const handleLogout = () => {
  userStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="flex flex-col bg-gray-800 min-h-screen">
    <div class="lg:w-[75vw] w-[90vw] mx-auto pb-8">
      <div
        v-if="user"
        class="flex flex-row min-h-12 p-5 justify-between align-middle bg-orange-900 fixed top-0 left-0 w-screen z-50"
      >
        <h1
          @click="$router.push('/')"
          class="h5 leading-none cursor-pointer hover:opacity-80 transition-opacity"
        >
          StackUnderflow
        </h1>
        <div class="flex flex-col">
          <span>Hi, {{ user }}!</span>
          <span
            @click="handleLogout"
            class="cursor-pointer hover:underline decoration-double"
            >Logout</span
          >
        </div>
      </div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
