export type AttemptState = 'Pending' | 'In_progress' | 'Resolved' | 'Rejected';

export interface ResistanceAttempt {
  id: number;
  victimName: string;
  description: string;
  state: AttemptState;
  daemonUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttemptRequest {
  victimName: string;
  description: string;
}

export interface UpdateAttemptRequest {
  description?: string;
  state?: AttemptState;
}
