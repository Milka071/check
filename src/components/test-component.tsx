"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateProcedureForm } from "@/components/create-procedure-form";
import { Procedure } from "@/lib/types";

export function TestComponent() {
  const [showForm, setShowForm] = useState(false);
  const [createdProcedures, setCreatedProcedures] = useState<Procedure[]>([]);

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
    
    setCreatedProcedures([...createdProcedures, procedure]);
    setShowForm(false);
    console.log("Создана процедура:", procedure);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Тестовый компонент</h1>
      
      {!showForm ? (
        <div className="space-y-4">
          <Button onClick={() => setShowForm(true)}>
            Создать тестовую процедуру
          </Button>
          
          {createdProcedures.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Созданные процедуры:</h2>
              {createdProcedures.map((proc) => (
                <div key={proc.id} className="p-3 border rounded mb-2">
                  <h3 className="font-medium">{proc.title}</h3>
                  <p className="text-sm text-muted-foreground">{proc.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Шагов: {proc.steps.length}, ID: {proc.id}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <CreateProcedureForm 
          onSubmit={handleCreateProcedure}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}