"use client";

import { useState, useEffect } from "react";
import { DailyProcedures } from "@/components/daily-procedures";
import { Procedure, DailySchedule } from "@/lib/types";
import { useSupabase } from "@/contexts/SupabaseContext";
import { ProcedureService } from "@/services/procedureService";

export default function Home() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [schedules, setSchedules] = useState<DailySchedule[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dataLoading, setDataLoading] = useState(false);
  const { session, user, loading } = useSupabase();

  // Load data from Supabase
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setDataLoading(true);
      const [loadedProcedures, loadedSchedules] = await Promise.all([
        ProcedureService.getProcedures(user.id),
        ProcedureService.getSchedules(user.id)
      ]);
      
      setProcedures(loadedProcedures);
      setSchedules(loadedSchedules);
    } catch (error) {
      console.error("Error loading data:", error);
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setDataLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const savedProcedures = localStorage.getItem('procedures');
    const savedSchedules = localStorage.getItem('schedules');
    
    if (savedProcedures) {
      try {
        const parsedProcedures = JSON.parse(savedProcedures);
        const proceduresWithDates = parsedProcedures.map((proc: any) => ({
          ...proc,
          createdAt: new Date(proc.createdAt),
          updatedAt: new Date(proc.updatedAt),
          scheduledDate: proc.scheduledDate ? new Date(proc.scheduledDate) : undefined,
          steps: proc.steps.map((step: any) => ({
            ...step,
            completed: step.completed || false
          }))
        }));
        setProcedures(proceduresWithDates);
      } catch (e) {
        console.error('Ошибка при загрузке процедур:', e);
      }
    }
    
    if (savedSchedules) {
      try {
        const parsedSchedules = JSON.parse(savedSchedules);
        const schedulesWithDates = parsedSchedules.map((schedule: any) => ({
          ...schedule,
          date: new Date(schedule.date)
        }));
        setSchedules(schedulesWithDates);
      } catch (e) {
        console.error('Ошибка при загрузке расписаний:', e);
      }
    }
  };

  const handleCreateProcedure = async (newProcedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'userId'>) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    
    try {
      const procedureToCreate = {
        ...newProcedure,
        userId: user.id,
        completed: false
      };
      
      const createdProcedure = await ProcedureService.createProcedure(procedureToCreate, user.id);
      setProcedures([...procedures, createdProcedure]);
    } catch (error) {
      console.error("Error creating procedure:", error);
      // Fallback to localStorage
      const procedureId = `proc-${Date.now()}`;
      const procedure: Procedure = {
        ...newProcedure,
        id: procedureId,
        user_id: user?.id || "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false,
        steps: newProcedure.steps.map((step, index) => ({
          ...step,
          procedureId: procedureId,
          id: `step-${Date.now()}-${index}`,
          completed: false
        }))
      };
      
      const newProcedures = [...procedures, procedure];
      setProcedures(newProcedures);
      localStorage.setItem('procedures', JSON.stringify(newProcedures));
    }
  };

  const handleAddToSchedule = async (procedureId: string, date: Date) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    
    const dateStr = date.toISOString().split('T')[0];
    const existingSchedule = schedules.find((s: DailySchedule) => 
      new Date(s.date).toISOString().split('T')[0] === dateStr
    );
    
    try {
      if (existingSchedule) {
        // Update existing schedule
        const updatedSchedule = {
          ...existingSchedule,
          procedureIds: [...existingSchedule.procedureIds, procedureId]
        };
        
        await ProcedureService.updateSchedule(updatedSchedule);
        setSchedules(schedules.map(s => 
          s.id === existingSchedule.id ? updatedSchedule : s
        ));
      } else {
        // Create new schedule
        const newSchedule: DailySchedule = {
          id: `schedule-${Date.now()}`,
          user_id: user.id,
          date: date,
          procedureIds: [procedureId]
        };
        
        const createdSchedule = await ProcedureService.createSchedule(newSchedule, user.id);
        setSchedules([...schedules, createdSchedule]);
      }
    } catch (error) {
      console.error("Error saving schedule to Supabase:", error);
      // Fallback to localStorage
      let newSchedules: DailySchedule[] = [];
      
      if (existingSchedule) {
        newSchedules = schedules.map((s: DailySchedule) => 
          new Date(s.date).toISOString().split('T')[0] === dateStr
            ? { ...s, procedureIds: [...s.procedureIds, procedureId] }
            : s
        );
      } else {
        const newSchedule: DailySchedule = {
          id: `schedule-${Date.now()}`,
          user_id: user?.id || "user-1",
          date: date,
          procedureIds: [procedureId]
        };
        newSchedules = [...schedules, newSchedule];
      }
      
      setSchedules(newSchedules);
      localStorage.setItem('schedules', JSON.stringify(newSchedules));
    }
  };

  const handleRemoveFromSchedule = async (procedureId: string, date: Date) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    
    const dateStr = date.toISOString().split('T')[0];
    const existingSchedule = schedules.find((s: DailySchedule) => 
      new Date(s.date).toISOString().split('T')[0] === dateStr
    );
    
    if (!existingSchedule) return;
    
    try {
      if (existingSchedule.procedureIds.length === 1 && existingSchedule.procedureIds[0] === procedureId) {
        // Remove the entire schedule if it only contains this procedure
        await ProcedureService.deleteSchedule(existingSchedule.id);
        setSchedules(schedules.filter(s => s.id !== existingSchedule.id));
      } else {
        // Remove the procedure from the schedule
        const updatedSchedule = {
          ...existingSchedule,
          procedureIds: existingSchedule.procedureIds.filter(id => id !== procedureId)
        };
        
        await ProcedureService.updateSchedule(updatedSchedule);
        setSchedules(schedules.map(s => 
          s.id === existingSchedule.id ? updatedSchedule : s
        ));
      }
    } catch (error) {
      console.error("Error removing from schedule:", error);
      // Fallback to localStorage
      const newSchedules = schedules.map((s: DailySchedule) => {
        if (new Date(s.date).toISOString().split('T')[0] === dateStr) {
          return {
            ...s,
            procedureIds: s.procedureIds.filter((id: string) => id !== procedureId)
          };
        }
        return s;
      }).filter((s: DailySchedule) => s.procedureIds.length > 0);
      
      setSchedules(newSchedules);
      localStorage.setItem('schedules', JSON.stringify(newSchedules));
    }
  };

  const handleUpdateProcedure = async (updatedProcedure: Procedure) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    
    try {
      await ProcedureService.updateProcedure(updatedProcedure);
      setProcedures(procedures.map(p => p.id === updatedProcedure.id ? updatedProcedure : p));
    } catch (error) {
      console.error("Error updating procedure:", error);
      // Fallback to localStorage
      const newProcedures = procedures.map(p => p.id === updatedProcedure.id ? updatedProcedure : p);
      setProcedures(newProcedures);
      localStorage.setItem('procedures', JSON.stringify(newProcedures));
    }
  };

  const handleDeleteProcedure = async (procedureId: string) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    
    try {
      await ProcedureService.deleteProcedure(procedureId);
      setProcedures(procedures.filter(p => p.id !== procedureId));
      
      // Remove from schedules
      const newSchedules = schedules.map(s => ({
        ...s,
        procedureIds: s.procedureIds.filter(id => id !== procedureId)
      })).filter(s => s.procedureIds.length > 0);
      setSchedules(newSchedules);
    } catch (error) {
      console.error("Error deleting procedure:", error);
      // Fallback to localStorage
      const newProcedures = procedures.filter(p => p.id !== procedureId);
      setProcedures(newProcedures);
      localStorage.setItem('procedures', JSON.stringify(newProcedures));
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Добро пожаловать в Библиотеку Личных Процедур</h1>
          <p className="mb-6">Пожалуйста, войдите в систему, чтобы начать использовать приложение</p>
          <a href="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Войти
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Библиотека Личных Процедур
        </h1>
        <p className="text-lg text-muted-foreground">
          Организуйте свои ежедневные задачи и привычки в простые процедуры
        </p>
      </div>
      <DailyProcedures
        procedures={procedures}
        schedules={schedules}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onCreateProcedure={handleCreateProcedure}
        onUpdateProcedure={handleUpdateProcedure}
        onDeleteProcedure={handleDeleteProcedure}
        onAddToSchedule={handleAddToSchedule}
        onRemoveFromSchedule={handleRemoveFromSchedule}
      />
    </div>
  );
}