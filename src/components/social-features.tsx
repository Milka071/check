"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Share2, 
  Heart, 
  MessageCircle, 
  Plus, 
  Search,
  Globe,
  Lock
} from "lucide-react";

export function SocialFeatures() {
  const publicTemplates = [
    {
      id: "1",
      title: "Медитация для начинающих",
      author: "Мария Иванова",
      likes: 124,
      comments: 12,
      isLiked: false
    },
    {
      id: "2",
      title: "Утренняя зарядка",
      author: "Алексей Петров",
      likes: 89,
      comments: 7,
      isLiked: true
    },
    {
      id: "3",
      title: "Планирование дня",
      author: "Елена Сидорова",
      likes: 256,
      comments: 23,
      isLiked: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Сообщество
        </CardTitle>
        <CardDescription>
          Делитесь процедурами и находите вдохновение
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск публичных процедур..."
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать
          </Button>
        </div>
        
        <div className="space-y-4">
          {publicTemplates.map((template) => (
            <div key={template.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{template.title}</h3>
                  <p className="text-sm text-muted-foreground">Автор: {template.author}</p>
                </div>
                <Button variant="ghost" size="icon">
                  {template.isLiked ? (
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{template.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>{template.comments}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t space-y-4">
          <h3 className="font-medium">Настройки приватности</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5" />
                <div>
                  <div className="font-medium">Публичный профиль</div>
                  <div className="text-sm text-muted-foreground">
                    Ваш профиль виден другим пользователям
                  </div>
                </div>
              </div>
              <Button variant="outline">Включить</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5" />
                <div>
                  <div className="font-medium">Приватные процедуры</div>
                  <div className="text-sm text-muted-foreground">
                    Сделать все процедуры приватными
                  </div>
                </div>
              </div>
              <Button variant="outline">Включить</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}