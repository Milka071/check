"use client";

import { useState } from "react";
import { ProcedureCard } from "@/components/procedure-card";
import { CreateProcedureForm } from "@/components/create-procedure-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Procedure } from "@/lib/types";
import { Plus, Search } from "lucide-react";

// Заглушки для демонстрации
const mockProcedures: Procedure[] = [
  {
    id: "proc-1",
    title: "Утренний ритуал",
    description: "Комплекс процедур для продуктивного начала дня",
    steps: [
      { id: "step-1", procedureId: "proc-1", title: "Проснуться", description: "", order: 0, completed: false },
      { id: "step-2", procedureId: "proc-1", title: "Выпить воды", description: "", order: 1, completed: false },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
    isDaily: true
  },
  {
    id: "proc-2",
    title: "Вечерний уход",
    description: "Процедуры для подготовки ко сну",
    steps: [
      { id: "step-3", procedureId: "proc-2", title: "Помыть лицо", description: "", order: 0, completed: false },
      { id: "step-4", procedureId: "proc-2", title: "Почистить зубы", description: "", order: 1, completed: false },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false
  },
  {
    id: "proc-3",
    title: "Подготовка к походу",
    description: "Чек-лист для сбора вещей в поход",
    steps: [
      { id: "step-5", procedureId: "proc-3", title: "Палатка", description: "", order: 0, completed: false },
      { id: "step-6", procedureId: "proc-3", title: "Спальник", description: "", order: 1, completed: false },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false
  }
];

export default function LibraryPage() {
  const [procedures, setProcedures] = useState<Procedure[]>(mockProcedures);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Фильтрация процедур по поисковому запросу
  const filteredProcedures = procedures.filter(procedure => 
    procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    procedure.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProcedure = (newProcedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    // Генерируем уникальный ID для процедуры
    const procedureId = `proc-${Date.now()}`;
    
    const procedure: Procedure = {
      ...newProcedure,
      id: procedureId,
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
      steps: newProcedure.steps.map((step, index) => ({
        ...step,
        id: `step-${Date.now()}-${index}`,
        procedureId: procedureId,
        completed: false
      }))
    };
    
    setProcedures([...procedures, procedure]);
    setShowCreateForm(false);
  };

  const handleDeleteProcedure = (id: string) => {
    setProcedures(procedures.filter(proc => proc.id !== id));
  };

  const handleEditProcedure = (id: string) => {
    // Пока просто выводим в консоль, позже реализуем редактирование
    console.log("Edit procedure", id);
  };

  const handleCompleteProcedure = (id: string) => {
    setProcedures(procedures.map(proc => 
      proc.id === id ? { ...proc, completed: !proc.completed, updatedAt: new Date() } : proc
    ));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Библиотека процедур</h1>
          <p className="text-muted-foreground">
            Все ваши созданные процедуры в одном месте
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать процедуру
        </Button>
      </div>

      {showCreateForm ? (
        <CreateProcedureForm 
          onSubmit={handleCreateProcedure}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск процедур..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredProcedures.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Процедуры не найдены</CardTitle>
                <CardDescription>
                  {searchTerm 
                    ? "По вашему запросу ничего не найдено" 
                    : "У вас еще нет созданных процедур"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowCreateForm(true)}>
                  Создать процедуру
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProcedures.map((procedure) => (
                <ProcedureCard
                  key={procedure.id}
                  procedure={procedure}
                  onEdit={() => handleEditProcedure(procedure.id)}
                  onDelete={() => handleDeleteProcedure(procedure.id)}
                  onComplete={() => handleCompleteProcedure(procedure.id)}
                  onStart={() => console.log("Start procedure", procedure.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}