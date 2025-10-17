"use client";

import { useState } from "react";
import { DailyProcedures } from "@/components/daily-procedures";
import { Procedure, DailySchedule } from "@/lib/types";

export default function Home() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [schedules, setSchedules] = useState<DailySchedule[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleCreateProcedure = (newProcedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    const procedure: Procedure = {
      ...newProcedure,
      id: `proc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
      steps: newProcedure.steps.map(step => ({
        ...step,
        id: `step-${Date.now()}-${step.order}`,
        procedureId: `proc-${Date.now()}`,
        completed: false
      }))
    };
    
    setProcedures([...procedures, procedure]);
  };

  const handleAddToSchedule = (procedureId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingSchedule = schedules.find(s => 
      s.date.toISOString().split('T')[0] === dateStr
    );
    
    if (existingSchedule) {
      // Если расписание уже существует, добавляем процедуру к нему
      setSchedules(schedules.map(s => 
        s.date.toISOString().split('T')[0] === dateStr
          ? { ...s, procedureIds: [...s.procedureIds, procedureId] }
          : s
      ));
    } else {
      // Если расписание не существует, создаем новое
      const newSchedule: DailySchedule = {
        id: `schedule-${Date.now()}`,
        date: date,
        procedureIds: [procedureId],
        userId: "user-1" // Заглушка для userId
      };
      setSchedules([...schedules, newSchedule]);
    }
  };

  const handleRemoveFromSchedule = (procedureId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSchedules(schedules.map(s => {
      if (s.date.toISOString().split('T')[0] === dateStr) {
        return {
          ...s,
          procedureIds: s.procedureIds.filter(id => id !== procedureId)
        };
      }
      return s;
    }).filter(s => s.procedureIds.length > 0)); // Удаляем пустые расписания
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Библиотека Личных Процедур</h1>
      <DailyProcedures
        procedures={procedures}
        schedules={schedules}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onCreateProcedure={handleCreateProcedure}
        onAddToSchedule={handleAddToSchedule}
        onRemoveFromSchedule={handleRemoveFromSchedule}
      />
    </div>
  );
}