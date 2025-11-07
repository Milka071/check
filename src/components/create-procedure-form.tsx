"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Procedure, ProcedureStep } from "@/lib/types";
import { Plus, Trash, Sparkles } from "lucide-react";

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
    if (steps.length <= 1) return; // Не позволяем удалить последний шаг
    setSteps(steps.filter((_: any, i: number) => i !== index));
  };

  const updateStep = (index: number, field: keyof ProcedureStep, value: string) => {
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
      steps: steps.map((step: any, index: number) => ({
        ...step,
        order: index
      }))
    };
    
    onSubmit(newProcedure);
    // Сбрасываем форму после отправки
    setTitle("");
    setDescription("");
    setIsDaily(false);
    setSteps([{ title: "", description: "", order: 0 }]);
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-background to-muted">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Создать новую процедуру</CardTitle>
        <CardDescription>
          Создайте многошаговую процедуру для выполнения ежедневных задач
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">Название процедуры</Label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Например: Утренний ритуал"
                required
                className="py-5 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Опишите цель процедуры"
                className="min-h-[100px] text-base"
              />
            </div>
            
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="isDaily"
                checked={isDaily}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsDaily(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isDaily" className="text-base cursor-pointer">Ежедневная процедура</Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base">Шаги процедуры</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить шаг
              </Button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {steps.map((step: any, index: number) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg bg-card transition-all hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">Шаг {index + 1}</Label>
                    {steps.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeStep(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={step.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateStep(index, 'title', e.target.value)}
                    placeholder={`Название шага ${index + 1}`}
                    required
                    className="py-4"
                  />
                  <Textarea
                    value={step.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateStep(index, 'description', e.target.value)}
                    placeholder="Описание шага"
                    className="min-h-[80px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="px-6 py-5 text-base">
            Отмена
          </Button>
          <Button type="submit" className="px-6 py-5 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Создать процедуру
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}