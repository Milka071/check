"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, CheckCircle } from "lucide-react";

export function NotificationManager() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Вечернее напоминание",
      description: "Подготовьтесь к завтрашнему дню",
      time: "21:00",
      enabled: true,
      type: "evening"
    },
    {
      id: "2",
      title: "Утреннее напоминание",
      description: "Начните выполнение процедур",
      time: "08:00",
      enabled: true,
      type: "morning"
    },
    {
      id: "3",
      title: "Напоминание о процедуре",
      description: "Выполнить 'Утренний ритуал'",
      time: "09:00",
      enabled: false,
      type: "custom"
    }
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled } 
        : notification
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Уведомления
        </CardTitle>
        <CardDescription>
          Настройте напоминания о процедурах
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              {notification.type === "evening" && <Clock className="h-5 w-5 mt-0.5 text-blue-500" />}
              {notification.type === "morning" && <Bell className="h-5 w-5 mt-0.5 text-green-500" />}
              {notification.type === "custom" && <CheckCircle className="h-5 w-5 mt-0.5 text-purple-500" />}
              <div>
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Время: {notification.time}</p>
              </div>
            </div>
            <Switch
              checked={notification.enabled}
              onCheckedChange={() => toggleNotification(notification.id)}
            />
          </div>
        ))}
        
        <Button variant="outline" className="w-full">
          Добавить напоминание
        </Button>
      </CardContent>
    </Card>
  );
}