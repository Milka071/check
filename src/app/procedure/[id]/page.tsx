"use client";

import { useState, useEffect, use } from "react";
import { ProcedureStep } from "@/components/procedure-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Procedure, ProcedureStep as ProcedureStepType } from "@/lib/types";
import { Check, ArrowLeft, Play, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/contexts/SupabaseContext";
import { ProcedureService } from "@/services/procedureService";

export default function ProcedureExecutionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, loading } = useSupabase();
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    if (user && id) {
      loadProcedure();
    }
  }, [user, id]);

  const loadProcedure = async () => {
    if (!user) return;
    
    try {
      setDataLoading(true);
      const procedures = await ProcedureService.getProcedures(user.id);
      const foundProcedure = procedures.find(p => p.id === id);
      
      if (foundProcedure) {
        setProcedure(foundProcedure);
      } else {
        console.error("Procedure not found");
        router.push("/");
      }
    } catch (error) {
      console.error("Error loading procedure:", error);
      router.push("/");
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading || !procedure) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const currentStep = procedure.steps[currentStepIndex];
  const completedSteps = procedure.steps.filter(step => step.completed).length;
  const progress = procedure.steps.length > 0 ? (completedSteps / procedure.steps.length) * 100 : 0;

  const handleStepToggle = async (stepId: string) => {
    if (!procedure || !user) return;
    
    const updatedProcedure = {
      ...procedure,
      steps: procedure.steps.map(step => 
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    };
    
    // Сначала обновляем локальное состояние для мгновенного отклика
    setProcedure(updatedProcedure);
    
    // Затем сохраняем в базу
    try {
      await ProcedureService.updateProcedure(updatedProcedure);
    } catch (error) {
      console.error("Error updating step:", error);
      // Откатываем изменения при ошибке
      setProcedure(procedure);
    }
  };

  const handleNextStep = async () => {
    if (!procedure || !user) return;
    
    // Отмечаем текущий шаг как выполненный
    const updatedProcedure = {
      ...procedure,
      steps: procedure.steps.map((step, index) => 
        index === currentStepIndex ? { ...step, completed: true } : step
      )
    };
    
    setProcedure(updatedProcedure);
    
    try {
      await ProcedureService.updateProcedure(updatedProcedure);
    } catch (error) {
      console.error("Error updating step:", error);
    }
    
    // Переходим к следующему шагу
    if (currentStepIndex < procedure.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCompleteProcedure = async () => {
    if (!procedure || !user) return;
    
    // Отмечаем последний шаг как выполненный и завершаем процедуру
    const updatedProcedure = {
      ...procedure,
      steps: procedure.steps.map((step, index) => 
        index === currentStepIndex ? { ...step, completed: true } : step
      ),
      completed: true,
      updatedAt: new Date()
    };
    
    try {
      await ProcedureService.updateProcedure(updatedProcedure);
      setProcedure(updatedProcedure);
      router.push("/");
    } catch (error) {
      console.error("Error completing procedure:", error);
    }
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

      <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-card to-muted">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{procedure.title}</CardTitle>
          {procedure.description && (
            <CardDescription>{procedure.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогресс выполнения</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-sm text-muted-foreground">
                {completedSteps} из {procedure.steps.length} шагов завершено
              </div>
            </div>
            
            <div className="flex items-center justify-center pt-2">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{currentStepIndex + 1}</div>
                <div className="text-sm text-muted-foreground">Шаг</div>
              </div>
              <div className="mx-4 text-muted-foreground">/</div>
              <div className="text-center">
                <div className="text-3xl font-bold">{procedure.steps.length}</div>
                <div className="text-sm text-muted-foreground">Всего</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <ProcedureStep
          step={currentStep}
          onToggle={() => handleStepToggle(currentStep.id)}
        />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="px-6 py-5"
          >
            Назад
          </Button>
          
          {currentStepIndex < procedure.steps.length - 1 ? (
            <Button onClick={handleNextStep} className="px-6 py-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Далее
              <Play className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCompleteProcedure} className="px-6 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Check className="mr-2 h-4 w-4" />
              Завершить процедуру
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}