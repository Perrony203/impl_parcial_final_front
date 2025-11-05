export interface Reward {
  id: number;
  daemonUsername: string;
  type: 'reward' | 'punishment';
  description: string;
  createdAt: string;
}

export interface CreateRewardRequest {
  daemonUsername: string;
  type: 'reward' | 'punishment';
  description: string;
}
