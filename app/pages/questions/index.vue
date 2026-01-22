<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useQnAStore } from "~/stores/qna";
import { useUserStore } from "~/stores/user";
import { EQuestionStatus, type TQuestion } from "~/types";

const qnaStore = useQnAStore();
const userStore = useUserStore();
const router = useRouter();

const currentUser = computed(() => userStore.userName);
const showNewQuestionForm = ref(false);
const newQuestionTitle = ref("");
const newQuestionDescription = ref("");

const createQuestion = () => {
  if (
    newQuestionTitle.value &&
    newQuestionDescription.value &&
    currentUser.value
  ) {
    const question: TQuestion = {
      id: `question-${Date.now()}`,
      title: newQuestionTitle.value,
      description: newQuestionDescription.value,
      status: EQuestionStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: currentUser.value,
      children: [],
    };
    qnaStore.addQuestion(question);
    router.push(`/questions/${question.id}`);
    showNewQuestionForm.value = false;
    newQuestionTitle.value = "";
    newQuestionDescription.value = "";
  }
};

const cancelNewQuestion = () => {
  showNewQuestionForm.value = false;
  newQuestionTitle.value = "";
  newQuestionDescription.value = "";
};
</script>

<template>
  <div class="flex flex-col min-h-screen mt-36 pb-20">
    <div class="flex flex-col items-center gap-2">
      <h2 class="h2">Questions</h2>
      <span>All the questions you could possibly care about</span>
      <button
        v-if="currentUser && !showNewQuestionForm"
        @click="showNewQuestionForm = true"
        class="bg-orange-700 hover:bg-orange-600 px-6 py-2 rounded-full mt-4 transition-colors"
      >
        <Icon icon="carbon:add" class="w-5 h-5 inline mr-2" />
        Ask Question
      </button>
    </div>

    <div v-if="showNewQuestionForm" class="bg-gray-600 p-6 rounded-2xl mt-6">
      <h3 class="h4 mb-4">Ask a New Question</h3>
      <div class="flex flex-col gap-4">
        <input
          v-model="newQuestionTitle"
          placeholder="Question title..."
          class="bg-gray-700 p-4 rounded-lg text-lg"
        />
        <textarea
          v-model="newQuestionDescription"
          placeholder="Describe your question in detail..."
          class="bg-gray-700 p-4 rounded-lg min-h-40"
        />
        <div class="flex gap-2">
          <button
            @click="createQuestion"
            :disabled="!newQuestionTitle || !newQuestionDescription"
            class="bg-green-700 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed px-6 py-2 rounded-full transition-colors"
          >
            Post Question
          </button>
          <button
            @click="cancelNewQuestion"
            class="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-full transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col gap-5 p-6 rounded-2xl bg-gray-600 w-full mt-6 gap-4"
    >
      <div
        v-for="question in qnaStore.questions"
        :key="question.id"
        class="flex flex-row justify-between bg-gray-800 p-5 rounded-2xl"
      >
        <div class="flex flex-col">
          <span>
            {{ new Date(question.updatedAt).toLocaleString() }}
          </span>
          <span> {{ question.user }} asked: </span>
          <h3 class="h4">{{ question.title }}</h3>
          <p>{{ question.description }}</p>
        </div>
        <div class="flex flex-col">
          <button
            @click="$router.push(`/questions/${question.id}`)"
            class="text-gray-100 hover:text-orange-500 transition-colors"
          >
            <Icon icon="carbon:arrow-right" class="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
