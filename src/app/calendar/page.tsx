"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ProcedureCard } from "@/components/procedure-card";
import { Button } from "@/components/ui/button";
import { Procedure, DailySchedule } from "@/lib/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Plus } from "lucide-react";

// Заглушки для демонстрации
const mockProcedures: Procedure[] = [
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
  }
];

const mockSchedules: DailySchedule[] = [
  {
    id: "sched-1",
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Завтра
    procedureIds: ["proc-1", "proc-2"],
    userId: "user-1"
  }
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [procedures] = useState<Procedure[]>(mockProcedures);
  const [schedules] = useState<DailySchedule[]>(mockSchedules);

  // Получаем процедуры, запланированные на выбранную дату
  const scheduledProcedures = date 
    ? schedules
        .filter(schedule => 
          format(new Date(schedule.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        )
        .flatMap(schedule => 
          schedule.procedureIds.map(id => procedures.find(p => p.id === id))
        )
        .filter(Boolean) as Procedure[]
    : [];

  // Получаем ежедневные процедуры
  const dailyProcedures = procedures.filter(p => p.isDaily);

  // Объединяем запланированные и ежедневные процедуры
  const allProceduresForDay = [...scheduledProcedures, ...dailyProcedures];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Календарь процедур</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить процедуру
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Выберите дату</CardTitle>
              <CardDescription>
                Просмотр процедур на выбранную дату
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {date 
                  ? `Процедуры на ${format(date, "d MMMM yyyy", { locale: ru })}` 
                  : "Выберите дату"}
              </CardTitle>
              <CardDescription>
                {date && `Всего процедур: ${allProceduresForDay.length}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {date ? (
                allProceduresForDay.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {allProceduresForDay.map((procedure) => (
                      <ProcedureCard
                        key={procedure.id}
                        procedure={procedure}
                        onEdit={() => console.log("Edit procedure", procedure.id)}
                        onDelete={() => console.log("Delete procedure", procedure.id)}
                        onComplete={() => console.log("Complete procedure", procedure.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      На выбранную дату нет запланированных процедур
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить процедуру
                    </Button>
                  </div>
                )
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Выберите дату в календаре для просмотра процедур
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}