"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Plus, Trash2 } from "lucide-react";
import { useSupabase } from "@/contexts/SupabaseContext";
import { supabase } from "@/lib/supabaseClient";

interface Reminder {
  id: string;
  procedure_id: string | null;
  reminder_time: string;
  reminder_days: number[];
  enabled: boolean;
  notification_type: string;
}

export function ReminderSettings() {
  const { user } = useSupabase();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReminders();
      checkNotificationPermission();
    }
  }, [user]);

  const checkNotificationPermission = () => {
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
    }
  };

  const loadReminders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('reminder_time');

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async () => {
    if (!user) return;

    const newReminder = {
      user_id: user.id,
      procedure_id: null,
      reminder_time: '20:00:00',
      reminder_days: [1, 2, 3, 4, 5, 6, 7],
      enabled: true,
      notification_type: 'browser'
    };

    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert([newReminder])
        .select()
        .single();

      if (error) throw error;
      setReminders([...reminders, data]);
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setReminders(reminders.map(r => 
        r.id === id ? { ...r, ...updates } : r
      ));
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReminders(reminders.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
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
          <div className="flex items-center justify-between">
            <div>
              <Label>Браузерные уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Разрешить отправку уведомлений в браузере
              </p>
            </div>
            <Button
              variant={notificationsEnabled ? "outline" : "default"}
              onClick={requestNotificationPermission}
              disabled={notificationsEnabled}
            >
              {notificationsEnabled ? "Включено" : "Включить"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Напоминания</CardTitle>
              <CardDescription>
                Настройте время напоминаний о процедурах
              </CardDescription>
            </div>
            <Button onClick={addReminder} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {reminders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Нет настроенных напоминаний
            </p>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={reminder.enabled}
                      onCheckedChange={(checked) => 
                        updateReminder(reminder.id, { enabled: checked })
                      }
                    />
                    <input
                      type="time"
                      value={reminder.reminder_time}
                      onChange={(e) => 
                        updateReminder(reminder.id, { reminder_time: e.target.value })
                      }
                      className="px-3 py-2 border rounded-md"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteReminder(reminder.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  {dayNames.map((day, index) => {
                    const dayNum = index + 1;
                    const isActive = reminder.reminder_days.includes(dayNum);
                    return (
                      <button
                        key={dayNum}
                        onClick={() => {
                          const newDays = isActive
                            ? reminder.reminder_days.filter(d => d !== dayNum)
                            : [...reminder.reminder_days, dayNum].sort();
                          updateReminder(reminder.id, { reminder_days: newDays });
                        }}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
