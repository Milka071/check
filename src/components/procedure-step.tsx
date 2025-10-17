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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={step.completed}
            onChange={onToggle}
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <CardTitle className="text-lg flex-1">{step.title}</CardTitle>
          {step.timer && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {Math.floor(step.timer / 60)}:{String(step.timer % 60).padStart(2, '0')}
            </div>
          )}
          <div className="flex space-x-1">
            {onPlay && (
              <Button variant="ghost" size="icon" onClick={onPlay}>
                <Play className="h-4 w-4" />
              </Button>
            )}
            {onExecute && (
              <Button variant="default" size="sm" onClick={onExecute}>
                <Check className="h-4 w-4 mr-2" />
                Выполнить
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {step.description && (
          <p className="text-muted-foreground mb-3">{step.description}</p>
        )}
        {step.mediaUrl && (
          <div className="mt-2">
            {step.mediaUrl.includes('.mp4') || step.mediaUrl.includes('.webm') ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Video className="mr-2 h-4 w-4" />
                Видео инструкция
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
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