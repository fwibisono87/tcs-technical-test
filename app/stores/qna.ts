import { defineStore } from "pinia";
import { EQuestionStatus, type TQuestion, type TComment } from "~/types";

const DUMMY_INITIAL_QUESTIONS: Array<TQuestion> = [
  {
    id: "how-to-center-a-div",
    title: "How do I center a div horizontally and vertically?",
    description:
      "I've been trying to center a div both horizontally and vertically for hours now. I've tried margin: auto but it only centers horizontally. What's the best way to achieve this in 2026?",
    status: EQuestionStatus.OPEN,
    createdAt: "2026-01-20T10:30:00.000Z",
    updatedAt: "2026-01-21T14:20:00.000Z",
    user: "francis",
    children: [
      {
        id: "center-div-comment-1",
        parentId: "how-to-center-a-div",
        content:
          "Use flexbox! Set display: flex, justify-content: center, and align-items: center on the parent container.",
        createdAt: "2026-01-20T11:15:00.000Z",
        updatedAt: "2026-01-20T11:15:00.000Z",
        user: "yoga",
        children: [],
      },
      {
        id: "center-div-comment-2",
        parentId: "how-to-center-a-div",
        content:
          "Grid is also great for this: display: grid; place-items: center;",
        createdAt: "2026-01-21T14:20:00.000Z",
        updatedAt: "2026-01-21T14:20:00.000Z",
        user: "farkhan",
        children: [],
      },
    ],
  },
  {
    id: "async-await-vs-promises",
    title: "When should I use async/await vs .then() promises?",
    description:
      "I'm working on a Node.js application and I'm confused about when to use async/await syntax versus traditional .then() promise chains. What are the pros and cons of each approach?",
    status: EQuestionStatus.ANSWERED,
    createdAt: "2026-01-19T08:45:00.000Z",
    updatedAt: "2026-01-19T16:30:00.000Z",
    user: "rafi",
    children: [
      {
        id: "async-comment-1",
        parentId: "async-await-vs-promises",
        content:
          "async/await is generally more readable and easier to debug. Use .then() when you need to handle multiple promises in parallel with Promise.all().",
        createdAt: "2026-01-19T09:30:00.000Z",
        updatedAt: "2026-01-19T09:30:00.000Z",
        user: "fafa",
        children: [
          {
            id: "async-comment-1-reply",
            parentId: "async-comment-1",
            content:
              "Actually, you can use Promise.all() with async/await too! Just await Promise.all([...])",
            createdAt: "2026-01-19T16:30:00.000Z",
            updatedAt: "2026-01-19T16:30:00.000Z",
            user: "rara",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "typescript-generic-constraints",
    title: "TypeScript generic constraints not working as expected",
    description:
      "I'm trying to create a generic function that only accepts objects with a specific property, but TypeScript keeps throwing errors. Here's my code: function getValue<T extends { id: string }>(obj: T) { return obj.id; }. How do I properly constrain my generic type?",
    status: EQuestionStatus.OPEN,
    createdAt: "2026-01-21T13:00:00.000Z",
    updatedAt: "2026-01-21T13:00:00.000Z",
    user: "fafa",
    children: [],
  },
  {
    id: "react-useeffect-infinite-loop",
    title: "useEffect causing infinite re-renders in React",
    description:
      "My React component keeps re-rendering infinitely and I think it's because of my useEffect hook. I'm fetching data from an API and updating state, but it never stops. I've tried adding dependencies but nothing works. Help!",
    status: EQuestionStatus.ANSWERED,
    createdAt: "2026-01-18T14:20:00.000Z",
    updatedAt: "2026-01-22T09:10:00.000Z",
    user: "rara",
    children: [
      {
        id: "useeffect-comment-1",
        parentId: "react-useeffect-infinite-loop",
        content:
          "You probably forgot to add an empty dependency array [] to your useEffect. Without it, the effect runs on every render!",
        createdAt: "2026-01-18T15:00:00.000Z",
        updatedAt: "2026-01-18T15:00:00.000Z",
        user: "francis",
        children: [],
      },
      {
        id: "useeffect-comment-2",
        parentId: "react-useeffect-infinite-loop",
        content:
          "Also make sure you're not updating state that's in your dependency array. That creates a loop: state changes → effect runs → state changes → effect runs...",
        createdAt: "2026-01-22T09:10:00.000Z",
        updatedAt: "2026-01-22T09:10:00.000Z",
        user: "yoga",
        children: [],
      },
    ],
  },
  {
    id: "git-merge-conflict-resolution",
    title: "Best practices for resolving Git merge conflicts?",
    description:
      "I'm working on a team project and we keep running into merge conflicts. What's the best way to handle these? Should I always use rebase instead of merge? Looking for some workflow advice.",
    status: EQuestionStatus.OPEN,
    createdAt: "2026-01-22T07:30:00.000Z",
    updatedAt: "2026-01-22T11:45:00.000Z",
    user: "farkhan",
    children: [
      {
        id: "git-comment-1",
        parentId: "git-merge-conflict-resolution",
        content:
          "Use 'git pull --rebase' to keep your history clean. But if you're working on a feature branch, regular merge is fine. The key is communication with your team!",
        createdAt: "2026-01-22T08:15:00.000Z",
        updatedAt: "2026-01-22T08:15:00.000Z",
        user: "rafi",
        children: [],
      },
      {
        id: "git-comment-2",
        parentId: "git-merge-conflict-resolution",
        content:
          "I recommend using a good merge tool like VS Code's built-in conflict resolver or GitKraken. Makes life so much easier!",
        createdAt: "2026-01-22T11:45:00.000Z",
        updatedAt: "2026-01-22T11:45:00.000Z",
        user: "francis",
        children: [],
      },
    ],
  },
];

export const useQnAStore = defineStore("qna", () => {
  const questions = ref<Array<TQuestion>>(DUMMY_INITIAL_QUESTIONS);

  const addQuestion = (question: TQuestion) => {
    questions.value.push(question);
  };

  const getQuestionById = (id: string): TQuestion | undefined => {
    return questions.value.find((q) => q.id === id);
  };

  const findEntityById = (id: string): TQuestion | TComment | undefined => {
    const question = questions.value.find((q) => q.id === id);
    if (question) return question;

    const searchInComments = (comments: TComment[]): TComment | undefined => {
      for (const comment of comments) {
        if (comment.id === id) return comment;
        const found = searchInComments(comment.children);
        if (found) return found;
      }
      return undefined;
    };

    for (const question of questions.value) {
      const found = searchInComments(question.children);
      if (found) return found;
    }

    return undefined;
  };

  const commentOnEntity = (comment: TComment): void => {
    const entity = findEntityById(comment.parentId);
    if (entity) {
      entity.children.push(comment);
    }
  };

  const getEntityComments = (id: string): TComment[] => {
    const entity = findEntityById(id);
    return entity?.children || [];
  };

  const updateQuestion = (id: string, updates: Partial<TQuestion>): void => {
    const question = getQuestionById(id);
    if (question) {
      Object.assign(question, updates, { updatedAt: new Date().toISOString() });
    }
  };

  const updateComment = (id: string, content: string): void => {
    const comment = findEntityById(id) as TComment;
    if (comment && "content" in comment) {
      comment.content = content;
      comment.updatedAt = new Date().toISOString();
    }
  };

  return {
    questions,
    addQuestion,
    getQuestionById,
    commentOnEntity,
    getEntityComments,
    updateQuestion,
    updateComment,
  };
});
