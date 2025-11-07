"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Image, Video, Check } from "lucide-react";
import type { ProcedureStep as ProcedureStepType } from "@/lib/types";

interface ProcedureStepProps {
  step: ProcedureStepType;
  onToggle: () => void;
  onPlay?: () => void;
  onExecute?: () => void; // Новая функция для выполнения шага
}

export function ProcedureStep({ step, onToggle, onPlay, onExecute }: ProcedureStepProps) {
  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-card to-muted">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-3">
          <div className="pt-1">
            <input
              type="checkbox"
              checked={step.completed}
              onChange={onToggle}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl flex items-start">
              <span className={step.completed ? "line-through text-muted-foreground" : ""}>
                {step.title}
              </span>
            </CardTitle>
            {step.timer && (
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <Clock className="mr-1 h-4 w-4" />
                {Math.floor(step.timer / 60)}:{String(step.timer % 60).padStart(2, '0')}
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            {onPlay && (
              <Button variant="ghost" size="icon" onClick={onPlay}>
                <Play className="h-4 w-4" />
              </Button>
            )}
            {onExecute && (
              <Button 
                variant={step.completed ? "outline" : "default"} 
                size="sm" 
                onClick={onExecute}
                className={step.completed ? "" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"}
              >
                <Check className="h-4 w-4 mr-2" />
                {step.completed ? "Выполнено" : "Выполнить"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {step.description && (
          <p className={`mb-3 ${step.completed ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
            {step.description}
          </p>
        )}
        {step.mediaUrl && (
          <div className="mt-2">
            {step.mediaUrl.includes('.mp4') || step.mediaUrl.includes('.webm') ? (
              <div className="flex items-center text-sm text-muted-foreground bg-secondary p-2 rounded">
                <Video className="mr-2 h-4 w-4" />
                Видео инструкция
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground bg-secondary p-2 rounded">
                <Image className="mr-2 h-4 w-4" />
                Изображение
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}