export interface Report {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface CreateReportRequest {
  title: string;
  description: string;
}
