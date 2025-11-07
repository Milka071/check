import { createClient } from '@supabase/supabase-js';

// Типы для TypeScript
export type ProcedureType = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_daily: boolean;
  created_at: string;
  updated_at: string;
};

export type ProcedureStepType = {
  id: string;
  procedure_id: string;
  title: string;
  description: string | null;
  order: number;
  completed: boolean;
  media_url: string | null;
  timer: number | null;
};

export type DailyScheduleType = {
  id: string;
  user_id: string;
  date: string;
  procedure_ids: string[];
};

// Получаем URL и ключ из переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Создаем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Функции для работы с процедурами
export const getProcedures = async (userId: string) => {
  const { data, error } = await supabase
    .from('procedures')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Ошибка при получении процедур:', error);
    return [];
  }
  
  return data;
};

export const createProcedure = async (procedure: Omit<ProcedureType, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('procedures')
    .insert([procedure])
    .select()
    .single();
    
  if (error) {
    console.error('Ошибка при создании процедуры:', error);
    return null;
  }
  
  return data;
};

export const updateProcedure = async (id: string, updates: Partial<ProcedureType>) => {
  const { data, error } = await supabase
    .from('procedures')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Ошибка при обновлении процедуры:', error);
    return null;
  }
  
  return data;
};

export const deleteProcedure = async (id: string) => {
  const { error } = await supabase
    .from('procedures')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Ошибка при удалении процедуры:', error);
    return false;
  }
  
  return true;
};

// Функции для работы с шагами процедур
export const getProcedureSteps = async (procedureId: string) => {
  const { data, error } = await supabase
    .from('procedure_steps')
    .select('*')
    .eq('procedure_id', procedureId)
    .order('order');
    
  if (error) {
    console.error('Ошибка при получении шагов процедуры:', error);
    return [];
  }
  
  return data;
};

export const createProcedureStep = async (step: Omit<ProcedureStepType, 'id'>) => {
  const { data, error } = await supabase
    .from('procedure_steps')
    .insert([step])
    .select()
    .single();
    
  if (error) {
    console.error('Ошибка при создании шага процедуры:', error);
    return null;
  }
  
  return data;
};

export const updateProcedureStep = async (id: string, updates: Partial<ProcedureStepType>) => {
  const { data, error } = await supabase
    .from('procedure_steps')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Ошибка при обновлении шага процедуры:', error);
    return null;
  }
  
  return data;
};

export const deleteProcedureStep = async (id: string) => {
  const { error } = await supabase
    .from('procedure_steps')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Ошибка при удалении шага процедуры:', error);
    return false;
  }
  
  return true;
};

// Функции для работы с расписаниями
export const getDailySchedules = async (userId: string) => {
  const { data, error } = await supabase
    .from('daily_schedules')
    .select('*')
    .eq('user_id', userId)
    .order('date');
    
  if (error) {
    console.error('Ошибка при получении расписаний:', error);
    return [];
  }
  
  return data;
};

export const createDailySchedule = async (schedule: Omit<DailyScheduleType, 'id'>) => {
  const { data, error } = await supabase
    .from('daily_schedules')
    .insert([schedule])
    .select()
    .single();
    
  if (error) {
    console.error('Ошибка при создании расписания:', error);
    return null;
  }
  
  return data;
};

export const updateDailySchedule = async (id: string, updates: Partial<DailyScheduleType>) => {
  const { data, error } = await supabase
    .from('daily_schedules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Ошибка при обновлении расписания:', error);
    return null;
  }
  
  return data;
};

export const deleteDailySchedule = async (id: string) => {
  const { error } = await supabase
    .from('daily_schedules')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Ошибка при удалении расписания:', error);
    return false;
  }
  
  return true;
};