"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Plus } from "lucide-react";
import { Procedure } from "@/lib/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ProcedureCardProps {
  procedure: Procedure;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
  onAddToSchedule?: (procedureId: string) => void; // Новая функция
}

export function ProcedureCard({ procedure, onEdit, onDelete, onComplete, onAddToSchedule }: ProcedureCardProps) {
  const completedSteps = procedure.steps.filter(step => step.completed).length;
  const totalSteps = procedure.steps.length;
  const isCompleted = procedure.completed;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{procedure.title}</CardTitle>
            {procedure.description && (
              <CardDescription className="mt-1">{procedure.description}</CardDescription>
            )}
          </div>
          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            isCompleted 
              ? "border-transparent bg-primary text-primary-foreground" 
              : "border-transparent bg-secondary text-secondary-foreground"
          }`}>
            {isCompleted ? "Завершено" : procedure.isDaily ? "Ежедневно" : "Активно"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {procedure.scheduledDate ? (
              <span>
                Запланировано на {format(new Date(procedure.scheduledDate), "d MMMM yyyy", { locale: ru })}
              </span>
            ) : (
              <span>Без даты</span>
            )}
          </div>
          
          <div className="flex items-center text-sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>{completedSteps} из {totalSteps} шагов завершено</span>
          </div>
          
          {procedure.steps.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогресс</span>
                <span>{Math.round((completedSteps / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-2">
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                Редактировать
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                Удалить
              </Button>
            </div>
            <div className="space-x-2">
              {onAddToSchedule && (
                <Button variant="outline" size="sm" onClick={() => onAddToSchedule(procedure.id)}>
                  <Plus className="h-4 w-4" />
                </Button>
              )}
              {!isCompleted && (
                <Button size="sm" onClick={onComplete}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Завершить
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}