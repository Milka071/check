export interface Procedure {
  id: string;
  user_id?: string; // Для интеграции с Supabase
  title: string;
  description: string;
  steps: ProcedureStep[];
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;
  completed: boolean;
  isDaily?: boolean; // Ежедневная процедура
}

export interface ProcedureStep {
  id: string;
  procedureId: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  mediaUrl?: string;
  timer?: number; // в секундах
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface Reminder {
  id: string;
  userId: string;
  procedureId: string;
  scheduledTime: Date;
  sent: boolean;
  type: 'evening' | 'morning' | 'custom';
}

// Новый тип для планирования процедур на дни
export interface DailySchedule {
  id: string;
  date: Date;
  procedureIds: string[]; // Ссылки на процедуры, запланированные на этот день
  userId: string;
}