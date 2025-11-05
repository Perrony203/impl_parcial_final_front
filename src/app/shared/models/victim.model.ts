export interface Victim {
  name: string;
  dangerLevel: number; // 1-10
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVictimRequest {
  name: string;
  dangerLevel: number;
  notes?: string;
}
