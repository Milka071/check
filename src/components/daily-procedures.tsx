"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SimpleCalendar } from "@/components/simple-calendar";
import { ProcedureCard } from "@/components/procedure-card";
import { CreateProcedureForm } from "@/components/create-procedure-form";
import { Procedure, DailySchedule } from "@/lib/types";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useSupabase } from "@/contexts/SupabaseContext";
import { ProcedureService } from "@/services/procedureService";
import { useEffect } from "react";

interface DailyProceduresProps {
  procedures: Procedure[];
  schedules: DailySchedule[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCreateProcedure: (procedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  onUpdateProcedure: (procedure: Procedure) => void;
  onDeleteProcedure: (procedureId: string) => void;
  onAddToSchedule: (procedureId: string, date: Date) => void;
  onRemoveFromSchedule: (procedureId: string, date: Date) => void;
}

export function DailyProcedures({
  procedures,
  schedules,
  currentDate,
  onDateChange,
  onCreateProcedure,
  onUpdateProcedure,
  onDeleteProcedure,
  onAddToSchedule,
  onRemoveFromSchedule
}: DailyProceduresProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [completions, setCompletions] = useState<Map<string, any>>(new Map());
  const { user } = useSupabase();

  // Получаем процедуры, запланированные на текущую дату
  const scheduledProcedures = schedules
    .filter((schedule: DailySchedule) => 
      format(new Date(schedule.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    )
    .flatMap((schedule: DailySchedule) => 
      schedule.procedureIds.map((id: string) => procedures.find((p: Procedure) => p.id === id))
    )
    .filter(Boolean) as Procedure[];

  // Получаем ежедневные процедуры
  const dailyProcedures = procedures.filter((p: Procedure) => p.isDaily);

  // Объединяем запланированные и ежедневные процедуры, убираем дубликаты
  const allProceduresForDay = Array.from(
    new Map([...scheduledProcedures, ...dailyProcedures].map(p => [p.id, p])).values()
  );

  // Загружаем статусы выполнения для текущей даты
  useEffect(() => {
    if (user) {
      loadCompletions();
    }
  }, [currentDate, user]);

  const loadCompletions = async () => {
    if (!user) return;
    const completionsMap = await ProcedureService.getCompletionsForDate(user.id, currentDate);
    setCompletions(completionsMap);
  };

  const handleToggleCompletion = async (procedureId: string, completed: boolean) => {
    if (!user) return;
    
    await ProcedureService.updateProcedureCompletion(user.id, procedureId, currentDate, completed);
    await loadCompletions();
  };

  // Получаем процедуры, которые еще не добавлены в расписание на текущий день
  const availableProcedures = procedures.filter((procedure: Procedure) => {
    // Исключаем ежедневные процедуры, так как они всегда отображаются
    if (procedure.isDaily) return false;
    
    // Проверяем, добавлена ли процедура в расписание на текущий день
    const isScheduled = scheduledProcedures.some((p: Procedure) => p && p.id === procedure.id);
    return !isScheduled;
  }).filter(Boolean) as Procedure[];

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
            className="rounded-full"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить процедуру
        </Button>
      </div>

      {showCalendar && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <SimpleCalendar
              selected={currentDate}
              onSelect={(date: Date) => {
                onDateChange(date);
                setShowCalendar(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      {showCreateForm || editingProcedure ? (
        <CreateProcedureForm 
          onSubmit={(procedure) => {
            if (editingProcedure) {
              onUpdateProcedure({
                ...editingProcedure,
                ...procedure
              });
              setEditingProcedure(null);
            } else {
              onCreateProcedure(procedure);
              setShowCreateForm(false);
            }
          }}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingProcedure(null);
          }}
          initialData={editingProcedure || undefined}
        />
      ) : (
        <div className="space-y-6">
          {allProceduresForDay.length === 0 ? (
            <Card className="border-2 border-dashed border-muted-foreground/20">
              <CardHeader>
                <CardTitle>Нет процедур на этот день</CardTitle>
                <CardDescription>
                  Добавьте процедуры, которые хотите выполнить сегодня
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Создать процедуру
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allProceduresForDay.map((procedure: Procedure) => {
                // Получаем статус выполнения для текущей даты
                const completion = completions.get(procedure.id);
                const displayProcedure = {
                  ...procedure,
                  completed: completion?.completed || false,
                  steps: procedure.steps.map(step => ({
                    ...step,
                    completed: completion?.completed_steps?.includes(step.id) || false
                  }))
                };
                
                return procedure ? (
                  <div key={procedure.id}>
                    <ProcedureCard
                      procedure={displayProcedure}
                      onEdit={() => setEditingProcedure(procedure)}
                      onDelete={() => {
                        if (confirm(`Удалить процедуру "${procedure.title}"?`)) {
                          onDeleteProcedure(procedure.id);
                        }
                      }}
                      onComplete={() => handleToggleCompletion(procedure.id, true)}
                      onToggleDaily={(updatedProcedure) => onUpdateProcedure(updatedProcedure)}
                      onAddToSchedule={(procedureId: string) => onAddToSchedule(procedureId, currentDate)}
                      onStart={() => console.log("Start procedure", procedure.id)}
                    />
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* Отображаем доступные процедуры для добавления */}
          {availableProcedures.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Доступные процедуры</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableProcedures.map((procedure: Procedure) => (
                  <Card key={procedure.id} className="border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors">
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