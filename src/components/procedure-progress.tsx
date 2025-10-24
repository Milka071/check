"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProcedureProgress(props) {
  const { procedure } = props;
  const completedSteps = procedure.steps.filter((step) => step.completed).length;
  const totalSteps = procedure.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{procedure.title}</CardTitle>
        <CardDescription>
          {procedure.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Прогресс выполнения</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
          <div className="text-sm text-muted-foreground">
            {completedSteps} из {totalSteps} шагов завершено
          </div>
        </div>
      </CardContent>
    </Card>
  );
}