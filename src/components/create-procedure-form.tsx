"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Procedure, ProcedureStep } from "@/lib/types";
import { Plus, Trash } from "lucide-react";

interface CreateProcedureFormProps {
  onSubmit: (procedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  onCancel: () => void;
}

export function CreateProcedureForm({ onSubmit, onCancel }: CreateProcedureFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDaily, setIsDaily] = useState(false); // Новое поле для ежедневных процедур
  const [steps, setSteps] = useState<Omit<ProcedureStep, 'id' | 'procedureId' | 'completed'>[]>([
    { title: "", description: "", order: 0 }
  ]);

  const addStep = () => {
    setSteps([...steps, { title: "", description: "", order: steps.length }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof ProcedureStep, value: string | number) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSteps(updatedSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const newProcedure = {
      title,
      description,
      isDaily,
      steps: steps.map((step, index) => ({
        ...step,
        id: `step-${Date.now()}-${index}`,
        procedureId: "",
        completed: false,
        order: index
      }))
    };
    
    onSubmit(newProcedure);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Создать новую процедуру</CardTitle>
        <CardDescription>
          Создайте многошаговую процедуру для выполнения ежедневных задач
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название процедуры</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Утренний ритуал"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите цель процедуры"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDaily"
              checked={isDaily}
              onChange={(e) => setIsDaily(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isDaily">Ежедневная процедура</Label>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Шаги процедуры</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить шаг
              </Button>
            </div>
            
            {steps.map((step, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Шаг {index + 1}</Label>
                  {steps.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeStep(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  placeholder={`Название шага ${index + 1}`}
                  required
                />
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  placeholder="Описание шага"
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">
            Создать процедуру
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}