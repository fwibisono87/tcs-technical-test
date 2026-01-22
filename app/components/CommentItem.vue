<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { TComment } from "~/types";

const props = defineProps<{
  comment: TComment;
  depth: number;
  currentUser: string;
  editingCommentId: string | null;
  replyingToId: string | null;
}>();

const emit = defineEmits<{
  startEdit: [comment: TComment];
  saveEdit: [commentId: string, content: string];
  cancelEdit: [];
  startReply: [commentId: string];
  submitReply: [parentId: string, content: string];
  cancelReply: [];
}>();

const editCommentContent = ref("");
const replyContent = ref("");

const isEditing = computed(() => props.editingCommentId === props.comment.id);
const isReplying = computed(() => props.replyingToId === props.comment.id);

const startEdit = () => {
  editCommentContent.value = props.comment.content;
  emit("startEdit", props.comment);
};

const saveEdit = () => {
  emit("saveEdit", props.comment.id, editCommentContent.value);
  editCommentContent.value = "";
};

const startReply = () => {
  replyContent.value = "";
  emit("startReply", props.comment.id);
};

const submitReply = () => {
  emit("submitReply", props.comment.id, replyContent.value);
  replyContent.value = "";
};

const isEdited = (createdAt: string, updatedAt: string) => {
  return createdAt !== updatedAt;
};

const bgClass = computed(() => {
  const classes = ["bg-gray-700", "bg-gray-800", "bg-gray-900"];
  return classes[Math.min(props.depth, classes.length - 1)];
});
</script>

<template>
  <div :class="['p-4 rounded-xl', bgClass]">
    <div class="flex justify-between items-start mb-2">
      <div class="flex flex-col">
        <span class="text-sm">
          <strong>{{ comment.user }}</strong>
          {{ depth === 0 ? "answered" : "replied" }}
        </span>
        <span class="text-xs text-gray-400">
          {{ new Date(comment.createdAt).toLocaleString() }}
          <span v-if="isEdited(comment.createdAt, comment.updatedAt)">
            (edited {{ new Date(comment.updatedAt).toLocaleString() }})
          </span>
        </span>
      </div>
      <button
        v-if="currentUser === comment.user && !isEditing"
        @click="startEdit"
        class="text-gray-100 hover:text-orange-500 transition-colors"
      >
        <Icon icon="carbon:edit" :class="depth === 0 ? 'w-5 h-5' : 'w-4 h-4'" />
      </button>
    </div>

    <p v-if="!isEditing" :class="depth === 0 ? 'text-base' : 'text-sm'">
      {{ comment.content }}
    </p>
    <div v-else class="flex flex-col gap-2">
      <textarea
        v-model="editCommentContent"
        :class="[
          'w-full p-3 rounded-lg min-h-20',
          depth === 0 ? 'bg-gray-800' : 'bg-gray-950',
        ]"
      />
      <div class="flex gap-2">
        <button
          @click="saveEdit"
          class="bg-green-700 hover:bg-green-600 px-3 py-1 rounded-full transition-colors text-sm"
        >
          Save
        </button>
        <button
          @click="emit('cancelEdit')"
          class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-full transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>

    <button
      v-if="currentUser && !isReplying && !isEditing"
      @click="startReply"
      class="text-sm text-orange-400 hover:text-orange-300 mt-2"
    >
      Reply
    </button>

    <div v-if="isReplying" class="mt-3 flex flex-col gap-2">
      <textarea
        v-model="replyContent"
        placeholder="Write your reply..."
        :class="[
          'w-full p-3 rounded-lg min-h-20',
          depth === 0 ? 'bg-gray-800' : 'bg-gray-950',
        ]"
      />
      <div class="flex gap-2">
        <button
          @click="submitReply"
          class="bg-orange-700 hover:bg-orange-600 px-4 py-2 rounded-full transition-colors text-sm"
        >
          Submit Reply
        </button>
        <button
          @click="emit('cancelReply')"
          class="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-full transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>

    <div
      v-if="comment.children.length > 0"
      class="mt-4 ml-6 flex flex-col gap-3 border-l-2 border-gray-600 pl-4"
    >
      <CommentItem
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :depth="depth + 1"
        :current-user="currentUser"
        :editing-comment-id="editingCommentId"
        :replying-to-id="replyingToId"
        @start-edit="emit('startEdit', $event)"
        @save-edit="
          (commentId, content) => emit('saveEdit', commentId, content)
        "
        @cancel-edit="emit('cancelEdit')"
        @start-reply="emit('startReply', $event)"
        @submit-reply="
          (parentId, content) => emit('submitReply', parentId, content)
        "
        @cancel-reply="emit('cancelReply')"
      />
    </div>
  </div>
</template>
