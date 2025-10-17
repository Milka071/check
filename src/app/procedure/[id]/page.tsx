"use client";

import { useState, useEffect } from "react";
import { ProcedureStep } from "@/components/procedure-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Procedure, ProcedureStep as ProcedureStepType } from "@/lib/types";
import { Check, ArrowLeft, Play } from "lucide-react";
import { useRouter } from "next/navigation";

// Заглушка для демонстрации
const mockProcedure: Procedure = {
  id: "proc-1",
  title: "Утренний ритуал",
  description: "Комплекс процедур для продуктивного начала дня",
  steps: [
    {
      id: "step-1",
      procedureId: "proc-1",
      title: "Проснуться и встать с кровати",
      description: "Не нажимать повторный сон на телефоне",
      order: 0,
      completed: false
    },
    {
      id: "step-2",
      procedureId: "proc-1",
      title: "Выпить стакан воды",
      description: "Очистить организм после сна",
      order: 1,
      completed: false
    },
    {
      id: "step-3",
      procedureId: "proc-1",
      title: "Сделать зарядку",
      description: "10 минут утренней гимнастики",
      order: 2,
      completed: false
    },
    {
      id: "step-4",
      procedureId: "proc-1",
      title: "Принять душ",
      description: "Контрастный душ для бодрости",
      order: 3,
      completed: false
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  completed: false
};

export default function ProcedureExecutionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [procedure, setProcedure] = useState<Procedure>(mockProcedure);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = procedure.steps[currentStepIndex];
  const completedSteps = procedure.steps.filter(step => step.completed).length;
  const progress = (completedSteps / procedure.steps.length) * 100;

  const handleStepToggle = (stepId: string) => {
    setProcedure(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, completed: !step.completed } : step
      ),
      completed: prev.steps.every(s => 
        s.id === stepId ? !s.completed : s.completed
      ) || prev.steps.every(s => 
        s.id === stepId ? true : s.completed
      )
    }));
  };

  const handleExecuteStep = (stepId: string) => {
    handleStepToggle(stepId);
  };

  const handleNextStep = () => {
    if (currentStepIndex < procedure.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCompleteProcedure = () => {
    setProcedure(prev => ({
      ...prev,
      completed: true,
      updatedAt: new Date()
    }));
    // Здесь можно добавить навигацию на главную страницу или показ уведомления
    router.push("/");
  };

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{procedure.title}</CardTitle>
          {procedure.description && (
            <CardDescription>{procedure.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Прогресс выполнения</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            <div className="text-sm text-muted-foreground">
              {completedSteps} из {procedure.steps.length} шагов завершено
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <ProcedureStep
          step={currentStep}
          onToggle={() => handleStepToggle(currentStep.id)}
          onExecute={() => handleExecuteStep(currentStep.id)}
        />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
          >
            Назад
          </Button>
          
          {currentStepIndex < procedure.steps.length - 1 ? (
            <Button onClick={handleNextStep}>
              Далее
              <Play className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCompleteProcedure}>
              <Check className="mr-2 h-4 w-4" />
              Завершить процедуру
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}