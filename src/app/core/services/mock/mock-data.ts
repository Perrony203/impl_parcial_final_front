import {
  User,
  Victim,
  ResistanceAttempt,
  Report,
  Reward,
  ResistanceContent,
  PaginatedResponse
} from '../../../shared/models';

/**
 * Why: Realistic fake data for testing UI
 * Note: IDs, timestamps, and relationships are consistent
 */

export const MOCK_USERS: User[] = [
  {
    username: 'admin',
    role: 'superadmin',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    username: 'daemon1',
    role: 'daemon',
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    username: 'daemon2',
    role: 'daemon',
    createdAt: '2024-03-10T09:15:00Z'
  }
];

export const MOCK_VICTIMS: Victim[] = [
  {
    name: 'Target Alpha',
    dangerLevel: 8,
    notes: 'High priority - heavily guarded facility',
    createdAt: '2024-10-01T08:00:00Z',
    updatedAt: '2024-10-15T12:30:00Z'
  },
  {
    name: 'Target Beta',
    dangerLevel: 5,
    notes: 'Medium risk - urban location',
    createdAt: '2024-10-05T10:20:00Z',
    updatedAt: '2024-10-05T10:20:00Z'
  },
  {
    name: 'Target Gamma',
    dangerLevel: 3,
    notes: 'Low priority - isolated area',
    createdAt: '2024-10-10T15:45:00Z',
    updatedAt: '2024-10-20T09:00:00Z'
  },
  {
    name: 'Target Delta',
    dangerLevel: 9,
    notes: 'Critical target - maximum security',
    createdAt: '2024-10-12T07:30:00Z',
    updatedAt: '2024-10-25T16:20:00Z'
  },
  {
    name: 'Target Epsilon',
    dangerLevel: 2,
    createdAt: '2024-10-18T11:10:00Z',
    updatedAt: '2024-10-18T11:10:00Z'
  }
];

export const MOCK_ATTEMPTS: ResistanceAttempt[] = [
  {
    id: 1,
    victimName: 'Target Alpha',
    description: 'Infiltration attempt at north entrance',
    state: 'In_progress',
    daemonUsername: 'daemon1',
    createdAt: '2024-11-01T14:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 2,
    victimName: 'Target Beta',
    description: 'Surveillance and reconnaissance mission',
    state: 'Resolved',
    daemonUsername: 'daemon1',
    createdAt: '2024-10-28T09:15:00Z',
    updatedAt: '2024-10-30T16:45:00Z'
  },
  {
    id: 3,
    victimName: 'Target Gamma',
    description: 'Data extraction operation',
    state: 'Pending',
    daemonUsername: 'daemon2',
    createdAt: '2024-11-03T08:20:00Z',
    updatedAt: '2024-11-03T08:20:00Z'
  },
  {
    id: 4,
    victimName: 'Target Delta',
    description: 'Asset neutralization plan',
    state: 'Rejected',
    daemonUsername: 'daemon2',
    createdAt: '2024-10-25T11:40:00Z',
    updatedAt: '2024-10-26T13:10:00Z'
  }
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    title: 'Security Breach at Sector 7',
    description: 'Unauthorized access detected. Immediate investigation required.',
    createdAt: '2024-11-01T16:30:00Z'
  },
  {
    id: 2,
    title: 'Equipment Malfunction',
    description: 'Communication devices experiencing intermittent failures.',
    createdAt: '2024-10-30T10:15:00Z'
  },
  {
    id: 3,
    title: 'Personnel Alert',
    description: 'Suspicious behavior observed. Recommend increased monitoring.',
    createdAt: '2024-10-28T14:50:00Z'
  }
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: 1,
    daemonUsername: 'daemon1',
    type: 'reward',
    description: 'Successfully completed high-risk mission',
    createdAt: '2024-10-30T17:00:00Z'
  },
  {
    id: 2,
    daemonUsername: 'daemon1',
    type: 'reward',
    description: 'Exceptional performance in surveillance operations',
    createdAt: '2024-10-25T12:30:00Z'
  },
  {
    id: 3,
    daemonUsername: 'daemon2',
    type: 'punishment',
    description: 'Protocol violation - unauthorized communication',
    createdAt: '2024-10-26T09:45:00Z'
  }
];

export const MOCK_CONTENT: ResistanceContent[] = [
  {
    id: 1,
    title: 'Resistance Manifesto',
    body: 'Our principles and mission statement for the liberation movement...',
    createdAt: '2024-09-15T10:00:00Z',
    updatedAt: '2024-10-01T14:20:00Z'
  },
  {
    id: 2,
    title: 'Operational Security Guidelines',
    body: 'Essential protocols for maintaining anonymity and secure communications...',
    createdAt: '2024-09-20T11:30:00Z',
    updatedAt: '2024-09-20T11:30:00Z'
  },
  {
    id: 3,
    title: 'Weekly Intelligence Briefing',
    body: 'Summary of key developments and strategic updates from the field...',
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-11-01T08:00:00Z'
  }
];

/**
 * Helper function to create paginated responses
 * Why: Simulates real API pagination behavior
 */
export function createPaginatedResponse<T>(
  items: T[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    data: paginatedItems,
    pagination: {
      page,
      limit,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / limit)
    }
  };
}
