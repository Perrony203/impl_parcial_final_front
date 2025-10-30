export enum AttemptState {
  PENDING = 'Pending',
  IN_PROGRESS = 'In_progress',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected'
}

export interface ResistanceAttempt {
  id: number;
  title: string;
  content: string;
  state: AttemptState;
  daemonId: number;
  victimId: number;
  victimName: string;
  createdAt: Date;
  updatedAt: Date;
}
