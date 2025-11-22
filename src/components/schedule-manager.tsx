"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SimpleCalendar } from "@/components/simple-calendar";
import { Procedure, DailySchedule } from "@/lib/types";
import { Trash2 } from "lucide-react";

interface ScheduleManagerProps {
  procedures: Procedure[];
  schedules: DailySchedule[];
  onAddToSchedule: (procedureId: string, date: Date) => void;
  onRemoveFromSchedule: (procedureId: string, date: Date) => void;
}

export function ScheduleManager({ procedures, schedules, onAddToSchedule, onRemoveFromSchedule }: ScheduleManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>("");

  // Получаем процедуры, запланированные на выбранную дату
  const dateStr = selectedDate.toISOString().split('T')[0];
  const todaySchedule = schedules.find(s => 
    new Date(s.date).toISOString().split('T')[0] === dateStr
  );
  
  const scheduledProcedureIds = todaySchedule?.procedureIds || [];
  const scheduledProcedures = scheduledProcedureIds
    .map(id => procedures.find(p => p.id === id))
    .filter(Boolean) as Procedure[];

  // Получаем ежедневные процедуры
  const dailyProcedures = procedures.filter(p => p.isDaily);
  
  // Объединяем запланированные и ежедневные процедуры
  const allProceduresForDay = Array.from(
    new Map([...scheduledProcedures, ...dailyProcedures].map(p => [p.id, p])).values()
  );

  const handleAddProcedure = () => {
    if (selectedProcedureId && selectedDate) {
      onAddToSchedule(selectedProcedureId, selectedDate);
      setSelectedProcedureId("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Календарь</CardTitle>
            <CardDescription>
              Выберите дату для просмотра расписания
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <SimpleCalendar
              selected={selectedDate}
              onSelect={(date: Date) => setSelectedDate(date)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Добавить процедуру</CardTitle>
            <CardDescription>
              Добавьте процедуру на выбранную дату
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {procedures.filter(p => !p.isDaily && !scheduledProcedureIds.includes(p.id)).length > 0 ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Процедура</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedProcedureId}
                    onChange={(e) => setSelectedProcedureId(e.target.value)}
                  >
                    <option value="">Выберите процедуру</option>
                    {procedures
                      .filter(p => !p.isDaily && !scheduledProcedureIds.includes(p.id))
                      .map((procedure) => (
                        <option key={procedure.id} value={procedure.id}>
                          {procedure.title}
                        </option>
                      ))}
                  </select>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                  onClick={handleAddProcedure}
                  disabled={!selectedProcedureId}
                >
                  Добавить в расписание
                </Button>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                {procedures.length === 0 ? (
                  <p>Нет доступных процедур. Создайте процедуру на главной странице.</p>
                ) : (
                  <p>Все процедуры уже добавлены на эту дату или являются ежедневными.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </CardTitle>
            <CardDescription>
              {allProceduresForDay.length > 0 
                ? `Запланировано процедур: ${allProceduresForDay.length}` 
                : 'Нет запланированных процедур'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allProceduresForDay.length > 0 ? (
              <div className="space-y-3">
                {allProceduresForDay.map((procedure) => (
                  <div key={procedure.id} className="flex items-start justify-between p-4 border rounded-lg bg-gradient-to-br from-card to-muted hover:shadow-md transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base">{procedure.title}</h3>
                        {procedure.isDaily && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                            Ежедневно
                          </span>
                        )}
                      </div>
                      {procedure.description && (
                        <p className="text-sm text-muted-foreground mb-2">{procedure.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Шагов: {procedure.steps.length}</span>
                        {procedure.completed && (
                          <span className="text-green-600 font-medium">✓ Завершено</span>
                        )}
                      </div>
                    </div>
                    {!procedure.isDaily && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onRemoveFromSchedule(procedure.id, selectedDate)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-2">Нет процедур на эту дату</p>
                <p className="text-sm">Добавьте процедуру из списка слева</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}