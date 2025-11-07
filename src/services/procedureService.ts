import { supabase } from "@/lib/supabaseClient";
import { Procedure, ProcedureStep, DailySchedule } from "@/lib/types";

export class ProcedureService {
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
      .order('procedure_id', 'order');

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
        userId: proc.user_id,
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
    const procedureId = `proc-${Date.now()}`;
    
    // Insert the procedure
    const { data: procedureData, error: procedureError } = await supabase
      .from('procedures')
      .insert([{
        id: procedureId,
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

    // Insert the steps
    if (procedure.steps.length > 0) {
      const stepsToInsert = procedure.steps.map((step, index) => ({
        id: `step-${Date.now()}-${index}`,
        procedure_id: procedureId,
        title: step.title,
        description: step.description,
        order: step.order,
        completed: step.completed || false,
        media_url: step.mediaUrl || null,
        timer: step.timer || null
      }));

      const { error: stepsError } = await supabase
        .from('procedure_steps')
        .insert(stepsToInsert);

      if (stepsError) {
        throw new Error(`Error creating procedure steps: ${stepsError.message}`);
      }
    }

    // Return the complete procedure with steps
    const createdProcedure: Procedure = {
      id: procedureId,
      userId: userId,
      title: procedure.title,
      description: procedure.description,
      steps: procedure.steps.map((step, index) => ({
        ...step,
        id: `step-${Date.now()}-${index}`,
        procedureId: procedureId,
        completed: step.completed || false
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
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
      if (step.id.startsWith('step-')) {
        // New step, insert it
        const { error: insertError } = await supabase
          .from('procedure_steps')
          .insert([{
            id: step.id,
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
      userId: schedule.user_id,
      date: new Date(schedule.date),
      procedureIds: schedule.procedure_ids || []
    }));

    return schedules;
  }

  static async createSchedule(schedule: Omit<DailySchedule, 'id'>, userId: string): Promise<DailySchedule> {
    const scheduleId = `schedule-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('daily_schedules')
      .insert([{
        id: scheduleId,
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
      id: scheduleId,
      userId: userId,
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