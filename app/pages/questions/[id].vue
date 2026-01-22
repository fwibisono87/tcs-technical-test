<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import { useQnAStore } from "~/stores/qna";
import { useUserStore } from "~/stores/user";
import { EQuestionStatus, type TComment } from "~/types";

const route = useRoute();
const qnaStore = useQnAStore();
const userStore = useUserStore();

const questionId = computed(() => route.params.id as string);
const question = computed(() => qnaStore.getQuestionById(questionId.value));
const currentUser = computed(() => userStore.userName);

const editingQuestion = ref(false);
const editingCommentId = ref<string | null>(null);
const editQuestionTitle = ref("");
const editQuestionDescription = ref("");

const newAnswer = ref("");
const replyingToId = ref<string | null>(null);

const startEditQuestion = () => {
  if (question.value) {
    editQuestionTitle.value = question.value.title;
    editQuestionDescription.value = question.value.description;
    editingQuestion.value = true;
  }
};

const saveQuestion = () => {
  if (
    question.value &&
    editQuestionTitle.value &&
    editQuestionDescription.value
  ) {
    qnaStore.updateQuestion(question.value.id, {
      title: editQuestionTitle.value,
      description: editQuestionDescription.value,
    });
    editingQuestion.value = false;
  }
};

const cancelEditQuestion = () => {
  editingQuestion.value = false;
  editQuestionTitle.value = "";
  editQuestionDescription.value = "";
};

const updateQuestionStatus = (status: EQuestionStatus) => {
  if (question.value) {
    qnaStore.updateQuestion(question.value.id, { status });
  }
};

const handleStatusChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  updateQuestionStatus(target.value as EQuestionStatus);
};

const startEditComment = (comment: TComment) => {
  editingCommentId.value = comment.id;
};

const saveComment = (commentId: string, content: string) => {
  if (content) {
    qnaStore.updateComment(commentId, content);
    editingCommentId.value = null;
  }
};

const cancelEditComment = () => {
  editingCommentId.value = null;
};

const addAnswer = () => {
  if (question.value && newAnswer.value && currentUser.value) {
    const answer: TComment = {
      id: `comment-${Date.now()}`,
      parentId: question.value.id,
      content: newAnswer.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: currentUser.value,
      children: [],
    };
    qnaStore.commentOnEntity(answer);
    newAnswer.value = "";
  }
};

const startReply = (commentId: string) => {
  replyingToId.value = commentId;
};

const cancelReply = () => {
  replyingToId.value = null;
};

const submitReply = (parentId: string, content: string) => {
  if (content && currentUser.value) {
    const reply: TComment = {
      id: `reply-${Date.now()}-${Math.random()}`,
      parentId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: currentUser.value,
      children: [],
    };
    qnaStore.commentOnEntity(reply);
    replyingToId.value = null;
  }
};

const isEdited = (createdAt: string, updatedAt: string) => {
  return createdAt !== updatedAt;
};
</script>

<template>
  <div class="flex flex-col min-h-screen mt-36 pb-20">
    <div v-if="question" class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <button
            @click="$router.push('/questions')"
            class="text-gray-100 hover:text-orange-500 transition-colors"
          >
            <Icon icon="carbon:arrow-left" class="w-6 h-6" />
          </button>
          <h2 v-if="!editingQuestion" class="h2">{{ question.title }}</h2>
          <input
            v-else
            v-model="editQuestionTitle"
            class="h2 bg-gray-700 px-4 py-2 rounded-lg flex-1"
          />
          <button
            v-if="currentUser === question.user && !editingQuestion"
            @click="startEditQuestion"
            class="text-gray-100 hover:text-orange-500 transition-colors"
          >
            <Icon icon="carbon:edit" class="w-6 h-6" />
          </button>
        </div>
        <span class="text-sm">
          Asked by <strong>{{ question.user }}</strong> on
          {{ new Date(question.createdAt).toLocaleString() }}
          <span
            v-if="isEdited(question.createdAt, question.updatedAt)"
            class="text-gray-400"
          >
            (edited {{ new Date(question.updatedAt).toLocaleString() }})
          </span>
        </span>
        <div class="flex items-center gap-2">
          <span
            :class="{
              'text-green-400': question.status === 'Answered',
              'text-orange-400': question.status === 'Open',
              'text-gray-400': question.status === 'Closed',
            }"
            class="text-sm font-semibold"
          >
            Status: {{ question.status }}
          </span>
          <select
            v-if="currentUser === question.user"
            :value="question.status"
            @change="handleStatusChange"
            class="bg-gray-700 text-sm px-2 py-1 rounded"
          >
            <option :value="EQuestionStatus.OPEN">Open</option>
            <option :value="EQuestionStatus.ANSWERED">Answered</option>
            <option :value="EQuestionStatus.CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div class="bg-gray-600 p-6 rounded-2xl">
        <p v-if="!editingQuestion" class="text-lg">
          {{ question.description }}
        </p>
        <textarea
          v-else
          v-model="editQuestionDescription"
          class="w-full bg-gray-700 p-4 rounded-lg text-lg min-h-32"
        />
        <div v-if="editingQuestion" class="flex gap-2 mt-4">
          <button
            @click="saveQuestion"
            class="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-full transition-colors"
          >
            Save
          </button>
          <button
            @click="cancelEditQuestion"
            class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="h3">Answers ({{ question.children.length }})</h3>

        <div v-if="question.children.length > 0" class="flex flex-col gap-4">
          <CommentItem
            v-for="comment in question.children"
            :key="comment.id"
            :comment="comment"
            :depth="0"
            :current-user="currentUser"
            :editing-comment-id="editingCommentId"
            :replying-to-id="replyingToId"
            @start-edit="startEditComment"
            @save-edit="saveComment"
            @cancel-edit="cancelEditComment"
            @start-reply="startReply"
            @submit-reply="submitReply"
            @cancel-reply="cancelReply"
          />
        </div>

        <div v-else class="text-center text-gray-400 py-8">
          No answers yet. Be the first to answer!
        </div>

        <div v-if="currentUser" class="bg-gray-700 p-5 rounded-2xl mt-4">
          <h4 class="h5 mb-3">Your Answer</h4>
          <textarea
            v-model="newAnswer"
            placeholder="Write your answer..."
            class="w-full bg-gray-800 p-4 rounded-lg min-h-32"
          />
          <button
            @click="addAnswer"
            :disabled="!newAnswer"
            class="bg-orange-700 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-full mt-3 transition-colors"
          >
            Post Answer
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-full">
      <h2 class="h2">Question not found</h2>
      <button
        @click="$router.push('/questions')"
        class="bg-orange-800 py-2 px-6 rounded-full mt-4 hover:bg-orange-700 transition-colors"
      >
        Back to Questions
      </button>
    </div>
  </div>
</template>
