export interface ResistanceContent {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentRequest {
  title: string;
  body: string;
}

export interface UpdateContentRequest {
  title?: string;
  body?: string;
}
