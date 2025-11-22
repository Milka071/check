"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScheduleManager } from "@/components/schedule-manager";
import { useSupabase } from "@/contexts/SupabaseContext";
import { ProcedureService } from "@/services/procedureService";
import { Procedure, DailySchedule } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();
  const { user, loading } = useSupabase();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [schedules, setSchedules] = useState<DailySchedule[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

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
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddToSchedule = async (procedureId: string, date: Date) => {
    if (!user) return;
    
    const dateStr = date.toISOString().split('T')[0];
    const existingSchedule = schedules.find(s => 
      new Date(s.date).toISOString().split('T')[0] === dateStr
    );
    
    try {
      if (existingSchedule) {
        const updatedSchedule = {
          ...existingSchedule,
          procedureIds: [...existingSchedule.procedureIds, procedureId]
        };
        
        await ProcedureService.updateSchedule(updatedSchedule);
        setSchedules(schedules.map(s => 
          s.id === existingSchedule.id ? updatedSchedule : s
        ));
      } else {
        const newSchedule: DailySchedule = {
          id: '',
          user_id: user.id,
          date: date,
          procedureIds: [procedureId]
        };
        
        const createdSchedule = await ProcedureService.createSchedule(newSchedule, user.id);
        setSchedules([...schedules, createdSchedule]);
      }
    } catch (error) {
      console.error("Error adding to schedule:", error);
    }
  };

  const handleRemoveFromSchedule = async (procedureId: string, date: Date) => {
    if (!user) return;
    
    const dateStr = date.toISOString().split('T')[0];
    const existingSchedule = schedules.find(s => 
      new Date(s.date).toISOString().split('T')[0] === dateStr
    );
    
    if (!existingSchedule) return;
    
    try {
      if (existingSchedule.procedureIds.length === 1) {
        await ProcedureService.deleteSchedule(existingSchedule.id);
        setSchedules(schedules.filter(s => s.id !== existingSchedule.id));
      } else {
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
          <h1 className="text-2xl font-bold mb-4">Войдите, чтобы использовать календарь</h1>
          <Button onClick={() => router.push('/login')}>Войти</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Календарь процедур</h1>
        <Button onClick={() => router.push('/')}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить процедуру
        </Button>
      </div>

      <ScheduleManager
        procedures={procedures}
        schedules={schedules}
        onAddToSchedule={handleAddToSchedule}
        onRemoveFromSchedule={handleRemoveFromSchedule}
      />
    </div>
  );
}