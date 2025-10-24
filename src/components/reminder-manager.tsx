"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Plus, Trash } from "lucide-react";

export function ReminderManager() {
  const [reminders, setReminders] = useState([
    {
      id: "1",
      title: "Вечернее напоминание",
      time: "21:00",
      enabled: true,
      type: "evening"
    },
    {
      id: "2",
      title: "Утреннее напоминание",
      time: "08:00",
      enabled: true,
      type: "morning"
    }
  ]);

  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "09:00",
    type: "custom"
  });

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, enabled: !reminder.enabled } 
        : reminder
    ));
  };

  const addReminder = () => {
    if (newReminder.title) {
      const reminder = {
        id: `reminder-${Date.now()}`,
        title: newReminder.title,
        time: newReminder.time,
        enabled: true,
        type: newReminder.type
      };
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: "",
        time: "09:00",
        type: "custom"
      });
    }
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Напоминания
        </CardTitle>
        <CardDescription>
          Настройте уведомления о процедурах
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">{reminder.title}</h3>
                  <p className="text-sm text-muted-foreground">{reminder.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={reminder.enabled}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
                {reminder.type === "custom" && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeReminder(reminder.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t space-y-4">
          <h3 className="font-medium">Добавить напоминание</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                placeholder="Название напоминания"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Время</Label>
              <Input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Тип</Label>
            <Select 
              value={newReminder.type} 
              onValueChange={(value) => setNewReminder({ ...newReminder, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Пользовательский</SelectItem>
                <SelectItem value="morning">Утренний</SelectItem>
                <SelectItem value="evening">Вечерний</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={addReminder} disabled={!newReminder.title}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}