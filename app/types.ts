export enum EQuestionStatus {
    OPEN = 'Open',
    ANSWERED = 'Answered',
    CLOSED = 'Closed',
}

export type TQuestion = {
    id: string;
    title: string;
    description: string;
    status: EQuestionStatus;
    createdAt: string;
    updatedAt: string;
    user: string
    children: TComment[];
}

export type TComment = {
    id: string;
    parentId: string; // can be question or comment
    content: string;
    createdAt: string;
    updatedAt: string;
    user: string;
    children: TComment[];
}

