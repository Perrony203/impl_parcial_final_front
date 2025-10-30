export enum UserRole {
  SUPERADMIN = 'superadmin',
  DAEMON = 'daemon'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
