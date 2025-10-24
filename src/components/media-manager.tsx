"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image, Video, FileAudio } from "lucide-react";

export function MediaManager(props: { onMediaUpload: (url: string) => void }) {
  const { onMediaUpload } = props;
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // В реальной реализации здесь будет загрузка файла на сервер
      const mediaUrl = URL.createObjectURL(file);
      onMediaUpload(mediaUrl);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Медиа-файлы
        </CardTitle>
        <CardDescription>
          Загрузите изображения, видео или аудио для шагов процедур
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Button variant="outline" className="flex flex-col items-center gap-2 h-24">
            <Image className="h-6 w-6" />
            <span>Изображение</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-24">
            <Video className="h-6 w-6" />
            <span>Видео</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-24">
            <FileAudio className="h-6 w-6" />
            <span>Аудио</span>
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="media-upload">Или загрузите файл</Label>
          <Input
            id="media-upload"
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileUpload}
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          Поддерживаемые форматы: JPG, PNG, MP4, MOV, MP3, WAV
        </div>
      </CardContent>
    </Card>
  );
}