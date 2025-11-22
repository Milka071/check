"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimpleCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
}

export function SimpleCalendar({ selected, onSelect }: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Получаем день недели первого дня (0 = воскресенье, нужно сделать 0 = понедельник)
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const daysInMonth = lastDay.getDate();
    const days: (Date | null)[] = [];
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Добавляем дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selected) return false;
    return date.toDateString() === selected.toDateString();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={previousMonth} className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <Button variant="outline" size="icon" onClick={nextMonth} className="h-7 w-7">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day ? (
              <Button
                variant="ghost"
                className={`w-full h-full p-0 font-normal ${
                  isSelected(day)
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    : isToday(day)
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                onClick={() => onSelect?.(day)}
              >
                {day.getDate()}
              </Button>
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
