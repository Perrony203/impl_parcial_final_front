export enum RewardPunishmentType {
  REWARD = 'reward',
  PUNISHMENT = 'punishment'
}

export interface RewardPunishment {
  id: number;
  daemonId: number;
  type: RewardPunishmentType;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
