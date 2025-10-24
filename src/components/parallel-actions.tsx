"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Layers, Plus, Play, Pause } from "lucide-react";

export function ParallelActions() {
  const parallelGroups = [
    {
      id: "group-1",
      title: "Утренний ритуал",
      actions: [
        { id: "action-1", title: "Заварить кофе", completed: true },
        { id: "action-2", title: "Включить музыку", completed: false },
        { id: "action-3", title: "Открыть окна", completed: true }
      ],
      status: "completed"
    },
    {
      id: "group-2",
      title: "Подготовка к работе",
      actions: [
        { id: "action-4", title: "Проверить почту", completed: false },
        { id: "action-5", title: "Подготовить документы", completed: false }
      ],
      status: "pending"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Параллельные действия
        </CardTitle>
        <CardDescription>
          Выполняйте несколько действий одновременно
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {parallelGroups.map((group) => (
            <div key={group.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{group.title}</h3>
                <Badge variant={group.status === "completed" ? "default" : "secondary"}>
                  {group.status === "completed" ? "Завершено" : "В процессе"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {group.actions.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded">
                    <Checkbox checked={action.completed} />
                    <span className={action.completed ? "line-through text-muted-foreground" : ""}>
                      {action.title}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Начать
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Пауза
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Добавить группу действий
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}