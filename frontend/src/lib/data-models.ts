// frontend/src/lib/data-models.ts

export interface User {
  email: string;
}


// frontend/src/lib/data-models.ts

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at: string;  // match backend field name exactly
  updated_at: string;  // match backend field name exactly
  user_id: number;
}
