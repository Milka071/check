"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScheduleManager } from "@/components/schedule-manager";

// Заглушки для демонстрации
const mockProcedures = [
  {
    id: "proc-1",
    title: "Утренний ритуал",
    description: "Комплекс процедур для продуктивного начала дня",
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
    isDaily: true
  },
  {
    id: "proc-2",
    title: "Вечерний уход",
    description: "Процедуры для подготовки ко сну",
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false
  },
  {
    id: "proc-3",
    title: "Спортивная тренировка",
    description: "Ежедневная физическая активность",
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false
  }
];

const mockSchedules = [
  {
    id: "sched-1",
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Завтра
    procedureIds: ["proc-1", "proc-2"],
    userId: "user-1"
  }
];

export default function CalendarPage() {
  const [procedures, setProcedures] = useState(mockProcedures);
  const [schedules, setSchedules] = useState(mockSchedules);

  const handleAddToSchedule = (procedureId, date) => {
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
      const newSchedule = {
        id: `schedule-${Date.now()}`,
        date: date,
        procedureIds: [procedureId],
        userId: "user-1" // Заглушка для userId
      };
      setSchedules([...schedules, newSchedule]);
    }
  };

  const handleRemoveFromSchedule = (scheduleId) => {
    setSchedules(schedules.filter(s => s.id !== scheduleId));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Календарь процедур</h1>
        <Button>
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