"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash, GitBranch } from "lucide-react";

export function ConditionalSteps() {
  const conditions = [
    {
      id: "1",
      stepId: "step-1",
      condition: "completed",
      targetStepId: "step-3",
      enabled: true
    },
    {
      id: "2",
      stepId: "step-2",
      condition: "skipped",
      targetStepId: "step-4",
      enabled: false
    }
  ];

  const steps = [
    { id: "step-1", title: "Проснуться" },
    { id: "step-2", title: "Выпить воды" },
    { id: "step-3", title: "Сделать зарядку" },
    { id: "step-4", title: "Принять душ" },
    { id: "step-5", title: "Почистить зубы" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Условные переходы
        </CardTitle>
        <CardDescription>
          Настройте условные переходы между шагами
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {conditions.map((condition) => (
            <div key={condition.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Switch checked={condition.enabled} />
                  <div>
                    <div className="font-medium">
                      Если "{steps.find(s => s.id === condition.stepId)?.title}" 
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {condition.condition === "completed" ? "выполнен" : "пропущен"} → 
                      "{steps.find(s => s.id === condition.targetStepId)?.title}"
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t space-y-4">
          <h3 className="font-medium">Добавить условие</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Шаг</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите шаг" />
                </SelectTrigger>
                <SelectContent>
                  {steps.map((step) => (
                    <SelectItem key={step.id} value={step.id}>
                      {step.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Условие</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите условие" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Выполнен</SelectItem>
                  <SelectItem value="skipped">Пропущен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Переход к</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите шаг" />
                </SelectTrigger>
                <SelectContent>
                  {steps.map((step) => (
                    <SelectItem key={step.id} value={step.id}>
                      {step.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить условие
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}