"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ProcedureCard } from "@/components/procedure-card";
import { CreateProcedureForm } from "@/components/create-procedure-form";
import { Procedure, DailySchedule } from "@/lib/types";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface DailyProceduresProps {
  procedures: Procedure[];
  schedules: DailySchedule[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCreateProcedure: (procedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  onAddToSchedule: (procedureId: string, date: Date) => void;
  onRemoveFromSchedule: (procedureId: string, date: Date) => void;
}

export function DailyProcedures({
  procedures,
  schedules,
  currentDate,
  onDateChange,
  onCreateProcedure,
  onAddToSchedule,
  onRemoveFromSchedule
}: DailyProceduresProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Получаем процедуры, запланированные на текущую дату
  const scheduledProcedures = schedules
    .filter(schedule => 
      format(new Date(schedule.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    )
    .flatMap(schedule => 
      schedule.procedureIds.map(id => procedures.find(p => p.id === id))
    )
    .filter(Boolean) as Procedure[];

  // Получаем ежедневные процедуры
  const dailyProcedures = procedures.filter(p => p.isDaily);

  // Объединяем запланированные и ежедневные процедуры
  const allProceduresForDay = [...scheduledProcedures, ...dailyProcedures];

  // Получаем процедуры, которые еще не добавлены в расписание на текущий день
  const availableProcedures = procedures.filter(procedure => {
    // Исключаем ежедневные процедуры, так как они всегда отображаются
    if (procedure.isDaily) return false;
    
    // Проверяем, добавлена ли процедура в расписание на текущий день
    const isScheduled = scheduledProcedures.some(p => p.id === procedure.id);
    return !isScheduled;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">
            Процедуры на {format(currentDate, "d MMMM yyyy", { locale: ru })}
          </h2>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить процедуру
        </Button>
      </div>

      {showCalendar && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => {
                if (date) {
                  onDateChange(date);
                  setShowCalendar(false);
                }
              }}
              initialFocus
            />
          </CardContent>
        </Card>
      )}

      {showCreateForm ? (
        <CreateProcedureForm 
          onSubmit={onCreateProcedure}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <div className="space-y-6">
          {allProceduresForDay.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Нет процедур на этот день</CardTitle>
                <CardDescription>
                  Добавьте процедуры, которые хотите выполнить сегодня
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowCreateForm(true)}>
                  Создать процедуру
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allProceduresForDay.map((procedure) => (
                <ProcedureCard
                  key={procedure.id}
                  procedure={procedure}
                  onEdit={() => console.log("Edit procedure", procedure.id)}
                  onDelete={() => console.log("Delete procedure", procedure.id)}
                  onComplete={() => console.log("Complete procedure", procedure.id)}
                  onAddToSchedule={(procedureId) => onAddToSchedule(procedureId, currentDate)}
                />
              ))}
            </div>
          )}

          {/* Отображаем доступные процедуры для добавления */}
          {availableProcedures.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Доступные процедуры</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableProcedures.map((procedure) => (
                  <Card key={procedure.id} className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{procedure.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => onAddToSchedule(procedure.id, currentDate)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить в расписание
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}