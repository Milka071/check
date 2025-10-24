"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export function ScheduleManager({ procedures, schedules, onAddToSchedule, onRemoveFromSchedule }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProcedureId, setSelectedProcedureId] = useState(null);

  // Получаем процедуры, запланированные на выбранную дату
  const scheduledProcedures = selectedDate 
    ? schedules.filter(schedule => 
        new Date(schedule.date).toDateString() === selectedDate.toDateString()
      )
    : [];

  const handleAddProcedure = () => {
    if (selectedProcedureId && selectedDate) {
      onAddToSchedule(selectedProcedureId, selectedDate);
      setSelectedProcedureId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Выберите дату</CardTitle>
            <CardDescription>
              Планирование процедур на выбранную дату
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Добавить процедуру</CardTitle>
            <CardDescription>
              Выберите процедуру для добавления в расписание
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Процедура</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedProcedureId || ""}
                onChange={(e) => setSelectedProcedureId(e.target.value || null)}
              >
                <option value="">Выберите процедуру</option>
                {procedures
                  .filter(p => !p.isDaily) // Исключаем ежедневные процедуры
                  .map((procedure) => (
                    <option key={procedure.id} value={procedure.id}>
                      {procedure.title}
                    </option>
                  ))}
              </select>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleAddProcedure}
              disabled={!selectedProcedureId || !selectedDate}
            >
              Добавить в расписание
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate 
                ? `Расписание на ${selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}` 
                : "Выберите дату"}
            </CardTitle>
            <CardDescription>
              {selectedDate && `Запланировано процедур: ${scheduledProcedures.length}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              scheduledProcedures.length > 0 ? (
                <div className="space-y-4">
                  {scheduledProcedures.map((schedule) => {
                    const procedure = procedures.find(p => p.id === schedule.procedureId);
                    if (!procedure) return null;
                    
                    return (
                      <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{procedure.title}</h3>
                          <p className="text-sm text-muted-foreground">{procedure.description}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onRemoveFromSchedule(schedule.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  На выбранную дату нет запланированных процедур
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Выберите дату для просмотра расписания
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}