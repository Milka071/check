"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { PartyPopper, Gift, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function HolidayCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Заглушки для праздничных дней
  const holidays = [
    { date: new Date(new Date().getFullYear(), 0, 1), name: "Новый год" },
    { date: new Date(new Date().getFullYear(), 0, 7), name: "Рождество" },
    { date: new Date(new Date().getFullYear(), 1, 23), name: "День защитника Отечества" },
    { date: new Date(new Date().getFullYear(), 2, 8), name: "Международный женский день" },
    { date: new Date(new Date().getFullYear(), 4, 1), name: "Праздник Весны и Труда" },
    { date: new Date(new Date().getFullYear(), 4, 9), name: "День Победы" },
    { date: new Date(new Date().getFullYear(), 5, 12), name: "День России" },
    { date: new Date(new Date().getFullYear(), 10, 4), name: "День народного единства" },
  ];

  const isHoliday = (dateToCheck: Date) => {
    return holidays.some(holiday => 
      holiday.date.getDate() === dateToCheck.getDate() &&
      holiday.date.getMonth() === dateToCheck.getMonth() &&
      holiday.date.getFullYear() === dateToCheck.getFullYear()
    );
  };

  const getHolidayName = (dateToCheck: Date) => {
    const holiday = holidays.find(h => 
      h.date.getDate() === dateToCheck.getDate() &&
      h.date.getMonth() === dateToCheck.getMonth() &&
      h.date.getFullYear() === dateToCheck.getFullYear()
    );
    return holiday ? holiday.name : null;
  };

  const selectedHoliday = date ? getHolidayName(date) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5" />
          Праздничные дни
        </CardTitle>
        <CardDescription>
          Автоматическое добавление праздников в календарь
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="rounded-md border"
              modifiers={{
                holiday: (date) => isHoliday(date)
              }}
              modifiersStyles={{
                holiday: {
                  backgroundColor: "#f59e0b",
                  color: "white"
                }
              }}
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Выбранная дата
              </h3>
              {date ? (
                <div>
                  <p className="text-lg">{format(date, "d MMMM yyyy", { locale: ru })}</p>
                  {selectedHoliday ? (
                    <div className="mt-2 flex items-center gap-2">
                      <Gift className="h-4 w-4 text-yellow-500" />
                      <Badge variant="secondary">{selectedHoliday}</Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      Обычный день
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Выберите дату</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Ближайшие праздники</h3>
              <div className="space-y-2">
                {holidays.slice(0, 5).map((holiday, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <span>{holiday.name}</span>
                    <Badge variant="outline">
                      {format(holiday.date, "d MMM", { locale: ru })}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Добавить праздник
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}