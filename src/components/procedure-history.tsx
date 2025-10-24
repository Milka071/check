"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function ProcedureHistory() {
  // Заглушки для истории выполнения процедур
  const history = [
    {
      id: "1",
      procedureTitle: "Утренний ритуал",
      completedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      duration: 15,
      stepsCompleted: 5,
      totalSteps: 5
    },
    {
      id: "2",
      procedureTitle: "Вечерний уход",
      completedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      duration: 10,
      stepsCompleted: 4,
      totalSteps: 4
    },
    {
      id: "3",
      procedureTitle: "Тренировка",
      completedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      duration: 45,
      stepsCompleted: 6,
      totalSteps: 6
    },
    {
      id: "4",
      procedureTitle: "Изучение нового",
      completedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
      duration: 30,
      stepsCompleted: 3,
      totalSteps: 3
    },
    {
      id: "5",
      procedureTitle: "Утренний ритуал",
      completedAt: new Date(new Date().setDate(new Date().getDate() - 4)),
      duration: 18,
      stepsCompleted: 5,
      totalSteps: 5
    }
  ];

  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy 'в' HH:mm", { locale: ru });
  };

  const getCompletionRate = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          История выполнения
        </CardTitle>
        <CardDescription>
          Завершенные процедуры и их статистика
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{item.procedureTitle}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.completedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.duration} мин</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">
                    {item.stepsCompleted}/{item.totalSteps} шагов
                  </Badge>
                  <div className="text-sm mt-1">
                    {getCompletionRate(item.stepsCompleted, item.totalSteps)}% завершено
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${getCompletionRate(item.stepsCompleted, item.totalSteps)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}