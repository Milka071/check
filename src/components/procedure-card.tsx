"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Plus, Play } from "lucide-react";
import { Procedure } from "@/lib/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";

interface ProcedureCardProps {
  procedure: Procedure;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
  onAddToSchedule?: (procedureId: string) => void;
  onStart?: () => void; // Новая функция для начала выполнения процедуры
}

export function ProcedureCard({ procedure, onEdit, onDelete, onComplete, onAddToSchedule, onStart }: ProcedureCardProps) {
  const completedSteps = procedure.steps.filter((step: any) => step.completed).length;
  const totalSteps = procedure.steps.length;
  const isCompleted = procedure.completed;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
  return (
    <Card className="w-full transition-all hover:shadow-lg border-0 bg-gradient-to-br from-card to-muted">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{procedure.title}</CardTitle>
            {procedure.description && (
              <CardDescription className="mt-1 line-clamp-2">{procedure.description}</CardDescription>
            )}
          </div>
          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            isCompleted 
              ? "border-transparent bg-primary text-primary-foreground" 
              : procedure.isDaily ? "border-transparent bg-secondary text-secondary-foreground" : "border-transparent bg-accent text-accent-foreground"
          }`}>
            {isCompleted ? "Завершено" : procedure.isDaily ? "Ежедневно" : "Активно"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
            {procedure.scheduledDate ? (
              <span>
                Запланировано на {format(new Date(procedure.scheduledDate), "d MMMM yyyy", { locale: ru })}
              </span>
            ) : (
              <span>Без даты</span>
            )}
          </div>
          
          <div className="flex items-center text-sm">
            <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{completedSteps} из {totalSteps} шагов завершено</span>
          </div>
          
          {procedure.steps.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогресс</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
              Редактировать
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="flex-1">
              Удалить
            </Button>
            {onStart && (
              <Link href={`/procedure/${procedure.id}`} className="flex-1">
                <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Play className="mr-2 h-4 w-4" />
                  Начать
                </Button>
              </Link>
            )}
            {onAddToSchedule && (
              <Button variant="outline" size="sm" onClick={() => onAddToSchedule && onAddToSchedule(procedure.id)} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                В расписание
              </Button>
            )}
            {!isCompleted && onComplete && (
              <Button size="sm" onClick={onComplete} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Завершить
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}