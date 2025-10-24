"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Users, FileText } from "lucide-react";

export function PremiumFeatures() {
  const features = [
    {
      title: "Неограниченные процедуры",
      description: "Создавайте сколько угодно процедур без ограничений",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Премиум-шаблоны",
      description: "Доступ к эксклюзивным шаблонам процедур",
      icon: <Zap className="h-5 w-5" />
    },
    {
      title: "Расширенные интеграции",
      description: "Подключение к дополнительным сервисам умного дома",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Приоритетная поддержка",
      description: "Быстрая помощь от нашей команды",
      icon: <Check className="h-5 w-5" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Премиум
            </CardTitle>
            <CardDescription>
              Расширенные возможности для продуктивности
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg py-1 px-3">
            299₽/мес
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="mt-0.5 text-primary">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <Button className="w-full">
            <Crown className="h-4 w-4 mr-2" />
            Перейти на Премиум
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}