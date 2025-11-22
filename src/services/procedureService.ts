import { supabase } from "@/lib/supabaseClient";
import { Procedure, ProcedureStep, DailySchedule } from "@/lib/types";

export class ProcedureService {
  // Получить статус выполнения процедуры на конкретную дату
  static async getProcedureCompletion(userId: string, procedureId: string, date: Date): Promise<any> {
    const dateStr = date.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('procedure_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('procedure_id', procedureId)
      .eq('date', dateStr)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching completion:', error);
    }

    return data;
  }

  // Обновить статус выполнения процедуры на конкретную дату
  static async updateProcedureCompletion(
    userId: string, 
    procedureId: string, 
    date: Date, 
    completed: boolean,
    completedSteps: string[] = []
  ): Promise<void> {
    const dateStr = date.toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('procedure_completions')
      .upsert({
        user_id: userId,
        procedure_id: procedureId,
        date: dateStr,
        completed,
        completed_steps: completedSteps,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,procedure_id,date'
      });

    if (error) {
      throw new Error(`Error updating completion: ${error.message}`);
    }
  }

  // Получить все выполнения процедур на конкретную дату
  static async getCompletionsForDate(userId: string, date: Date): Promise<Map<string, any>> {
    const dateStr = date.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('procedure_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr);

    if (error) {
      console.error('Error fetching completions:', error);
      return new Map();
    }

    const completionsMap = new Map();
    (data || []).forEach(completion => {
      completionsMap.set(completion.procedure_id, completion);
    });

    return completionsMap;
  }


  static async getProcedures(userId: string): Promise<Procedure[]> {
    // Get procedures
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (proceduresError) {
      throw new Error(`Error loading procedures: ${proceduresError.message}`);
    }

    // Get steps for all procedures
    const procedureIds = proceduresData?.map(p => p.id) || [];
    const { data: stepsData, error: stepsError } = await supabase
      .from('procedure_steps')
      .select('*')
      .in('procedure_id', procedureIds)
      .order('order', { ascending: true });

    if (stepsError) {
      throw new Error(`Error loading steps: ${stepsError.message}`);
    }

    // Combine procedures with their steps
    const proceduresWithSteps = (proceduresData || []).map(proc => {
      const procedureSteps = (stepsData || [])
        .filter(step => step.procedure_id === proc.id)
        .map(step => ({
          id: step.id,
          procedureId: step.procedure_id,
          title: step.title,
          description: step.description || "",
          order: step.order,
          completed: step.completed || false,
          mediaUrl: step.media_url || undefined,
          timer: step.timer || undefined
        }));

      return {
        id: proc.id,
        user_id: proc.user_id,
        title: proc.title,
        description: proc.description || "",
        steps: procedureSteps,
        createdAt: new Date(proc.created_at),
        updatedAt: new Date(proc.updated_at),
        scheduledDate: proc.scheduled_date ? new Date(proc.scheduled_date) : undefined,
        completed: proc.completed || false,
        isDaily: proc.is_daily || false
      };
    });

    return proceduresWithSteps;
  }

  static async createProcedure(procedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Procedure> {
    // Insert the procedure (let Supabase generate UUID)
    const { data: procedureData, error: procedureError } = await supabase
      .from('procedures')
      .insert([{
        user_id: userId,
        title: procedure.title,
        description: procedure.description,
        is_daily: procedure.isDaily || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed: procedure.completed || false
      }])
      .select()
      .single();

    if (procedureError) {
      throw new Error(`Error creating procedure: ${procedureError.message}`);
    }

    const procedureId = procedureData.id;

    // Insert the steps
    if (procedure.steps.length > 0) {
      const stepsToInsert = procedure.steps.map((step) => ({
        procedure_id: procedureId,
        title: step.title,
        description: step.description,
        order: step.order,
        completed: step.completed || false,
        media_url: step.mediaUrl || null,
        timer: step.timer || null
      }));

      const { data: stepsData, error: stepsError } = await supabase
        .from('procedure_steps')
        .insert(stepsToInsert)
        .select();

      if (stepsError) {
        throw new Error(`Error creating procedure steps: ${stepsError.message}`);
      }

      // Return the complete procedure with steps
      const createdProcedure: Procedure = {
        id: procedureId,
        user_id: userId,
        title: procedure.title,
        description: procedure.description,
        steps: (stepsData || []).map(step => ({
          id: step.id,
          procedureId: procedureId,
          title: step.title,
          description: step.description || "",
          order: step.order,
          completed: step.completed || false,
          mediaUrl: step.media_url || undefined,
          timer: step.timer || undefined
        })),
        createdAt: new Date(procedureData.created_at),
        updatedAt: new Date(procedureData.updated_at),
        completed: procedure.completed || false,
        isDaily: procedure.isDaily || false
      };

      return createdProcedure;
    }

    // Return procedure without steps
    const createdProcedure: Procedure = {
      id: procedureId,
      user_id: userId,
      title: procedure.title,
      description: procedure.description,
      steps: [],
      createdAt: new Date(procedureData.created_at),
      updatedAt: new Date(procedureData.updated_at),
      completed: procedure.completed || false,
      isDaily: procedure.isDaily || false
    };

    return createdProcedure;
  }

  static async updateProcedure(procedure: Procedure): Promise<Procedure> {
    // Update the procedure
    const { data: updatedProcedure, error: procedureError } = await supabase
      .from('procedures')
      .update({
        title: procedure.title,
        description: procedure.description,
        is_daily: procedure.isDaily,
        updated_at: new Date().toISOString(),
        completed: procedure.completed
      })
      .eq('id', procedure.id)
      .select()
      .single();

    if (procedureError) {
      throw new Error(`Error updating procedure: ${procedureError.message}`);
    }

    // Update or insert steps
    for (const step of procedure.steps) {
      if (!step.id || step.id.startsWith('temp-')) {
        // New step, insert it (let Supabase generate UUID)
        const { error: insertError } = await supabase
          .from('procedure_steps')
          .insert([{
            procedure_id: procedure.id,
            title: step.title,
            description: step.description,
            order: step.order,
            completed: step.completed,
            media_url: step.mediaUrl || null,
            timer: step.timer || null
          }]);
        
        if (insertError) {
          throw new Error(`Error inserting step: ${insertError.message}`);
        }
      } else {
        // Existing step, update it
        const { error: updateError } = await supabase
          .from('procedure_steps')
          .update({
            title: step.title,
            description: step.description,
            order: step.order,
            completed: step.completed,
            media_url: step.mediaUrl || null,
            timer: step.timer || null
          })
          .eq('id', step.id);
        
        if (updateError) {
          throw new Error(`Error updating step: ${updateError.message}`);
        }
      }
    }

    return procedure;
  }

  static async deleteProcedure(procedureId: string): Promise<void> {
    const { error } = await supabase
      .from('procedures')
      .delete()
      .eq('id', procedureId);

    if (error) {
      throw new Error(`Error deleting procedure: ${error.message}`);
    }
  }

  static async getSchedules(userId: string): Promise<DailySchedule[]> {
    const { data: schedulesData, error } = await supabase
      .from('daily_schedules')
      .select('*')
      .eq('user_id', userId)
      .order('date');

    if (error) {
      throw new Error(`Error loading schedules: ${error.message}`);
    }

    const schedules = (schedulesData || []).map(schedule => ({
      id: schedule.id,
      user_id: schedule.user_id,
      date: new Date(schedule.date),
      procedureIds: schedule.procedure_ids || []
    }));

    return schedules;
  }

  static async createSchedule(schedule: Omit<DailySchedule, 'id'>, userId: string): Promise<DailySchedule> {
    const { data, error } = await supabase
      .from('daily_schedules')
      .insert([{
        user_id: userId,
        date: schedule.date.toISOString().split('T')[0],
        procedure_ids: schedule.procedureIds
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating schedule: ${error.message}`);
    }

    const createdSchedule: DailySchedule = {
      id: data.id,
      user_id: userId,
      date: new Date(data.date),
      procedureIds: data.procedure_ids || []
    };

    return createdSchedule;
  }

  static async updateSchedule(schedule: DailySchedule): Promise<DailySchedule> {
    const { data, error } = await supabase
      .from('daily_schedules')
      .update({
        date: schedule.date.toISOString().split('T')[0],
        procedure_ids: schedule.procedureIds
      })
      .eq('id', schedule.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating schedule: ${error.message}`);
    }

    const updatedSchedule: DailySchedule = {
      ...schedule,
      date: new Date(data.date)
    };

    return updatedSchedule;
  }

  static async deleteSchedule(scheduleId: string): Promise<void> {
    const { error } = await supabase
      .from('daily_schedules')
      .delete()
      .eq('id', scheduleId);

    if (error) {
      throw new Error(`Error deleting schedule: ${error.message}`);
    }
  }
}