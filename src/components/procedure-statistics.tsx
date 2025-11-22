"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Procedure } from "@/lib/types";

interface ProcedureStatisticsProps {
  procedures: Procedure[];
}

export function ProcedureStatistics({ procedures }: ProcedureStatisticsProps) {
  // Рассчитываем статистику
  const totalProcedures = procedures.length;
  const completedProcedures = procedures.filter((p) => p.completed).length;
  const dailyProcedures = procedures.filter((p) => p.isDaily).length;
  
  const completionRate = totalProcedures > 0 ? (completedProcedures / totalProcedures) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Общая статистика</CardTitle>
          <CardDescription>
            Сводная информация по процедурам
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Всего процедур</span>
              <span className="font-medium">{totalProcedures}</span>
            </div>
            <div className="flex justify-between">
              <span>Завершено</span>
              <span className="font-medium">{completedProcedures}</span>
            </div>
            <div className="flex justify-between">
              <span>Ежедневные</span>
              <span className="font-medium">{dailyProcedures}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Процент завершения</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Информация</CardTitle>
          <CardDescription>
            Дополнительные данные
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Здесь будет отображаться статистика выполнения процедур.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}