"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Coffee, 
  Bath, 
  Dumbbell, 
  BookOpen, 
  ShoppingCart, 
  Plane, 
  Heart, 
  Star 
} from "lucide-react";

export function TemplateManager() {
  const templates = [
    {
      id: "1",
      title: "Утренний ритуал",
      description: "Начните день правильно",
      icon: <Coffee className="h-5 w-5" />,
      category: "Ежедневные",
      steps: 5
    },
    {
      id: "2",
      title: "Вечерний уход",
      description: "Подготовка ко сну",
      icon: <Bath className="h-5 w-5" />,
      category: "Ежедневные",
      steps: 4
    },
    {
      id: "3",
      title: "Тренировка",
      description: "Физическая активность",
      icon: <Dumbbell className="h-5 w-5" />,
      category: "Здоровье",
      steps: 6
    },
    {
      id: "4",
      title: "Изучение нового",
      description: "Развитие навыков",
      icon: <BookOpen className="h-5 w-5" />,
      category: "Образование",
      steps: 3
    },
    {
      id: "5",
      title: "Покупки",
      description: "Список покупок",
      icon: <ShoppingCart className="h-5 w-5" />,
      category: "Дом",
      steps: 4
    },
    {
      id: "6",
      title: "Путешествие",
      description: "Подготовка к поездке",
      icon: <Plane className="h-5 w-5" />,
      category: "Путешествия",
      steps: 8
    }
  ];

  const categories = [
    { name: "Ежедневные", count: 2 },
    { name: "Здоровье", count: 1 },
    { name: "Образование", count: 1 },
    { name: "Дом", count: 1 },
    { name: "Путешествия", count: 1 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Шаблоны процедур
        </CardTitle>
        <CardDescription>
          Готовые шаблоны для быстрого создания процедур
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category.name} ({category.count})
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {template.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {template.steps} шагов
                  </span>
                  <Button variant="outline" size="sm">
                    Использовать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Star className="h-4 w-4 mr-2" />
            Создать шаблон
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}