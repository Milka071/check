"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Archive, 
  ChevronRight, 
  Folder, 
  FileText, 
  Plus, 
  Link 
} from "lucide-react";

export function NestedProcedures() {
  const nestedProcedures = [
    {
      id: "parent-1",
      title: "Подготовка к походу",
      type: "folder",
      children: [
        { id: "child-1", title: "Снаряжение", type: "procedure" },
        { id: "child-2", title: "Продукты", type: "procedure" },
        { id: "child-3", title: "Документы", type: "procedure" }
      ]
    },
    {
      id: "parent-2",
      title: "Рабочий день",
      type: "folder",
      children: [
        { id: "child-4", title: "Утренний план", type: "procedure" },
        { id: "child-5", title: "Обеденный перерыв", type: "procedure" },
        { id: "child-6", title: "Вечерний отчет", type: "procedure" }
      ]
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="h-5 w-5" />;
      case "procedure":
        return <FileText className="h-5 w-5" />;
      default:
        return <Archive className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Вложенные процедуры
        </CardTitle>
        <CardDescription>
          Организуйте процедуры в иерархическую структуру
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {nestedProcedures.map((parent) => (
            <div key={parent.id} className="border rounded-lg">
              <div className="p-4 bg-muted rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(parent.type)}
                  <span className="font-medium">{parent.title}</span>
                  <Badge variant="secondary">{parent.children.length}</Badge>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4 space-y-2">
                {parent.children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <div className="flex items-center gap-2">
                      {getIcon(child.type)}
                      <span>{child.title}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Открыть
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Создать вложенную процедуру
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}