"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Download, 
  QrCode, 
  Wifi, 
  Battery, 
  Zap,
  Bell,
  Cloud
} from "lucide-react";

export function MobileAppManager() {
  const features = [
    {
      title: "Офлайн доступ",
      description: "Выполняйте процедуры без интернета",
      icon: <Wifi className="h-5 w-5" />,
      available: true
    },
    {
      title: "Push-уведомления",
      description: "Получайте напоминания в любое время",
      icon: <Bell className="h-5 w-5" />,
      available: true
    },
    {
      title: "Синхронизация",
      description: "Данные автоматически синхронизируются",
      icon: <Cloud className="h-5 w-5" />,
      available: true
    },
    {
      title: "Экономия батареи",
      description: "Оптимизировано для долгой работы",
      icon: <Battery className="h-5 w-5" />,
      available: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Мобильное приложение
        </CardTitle>
        <CardDescription>
          Управляйте процедурами на ходу
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-3" />
              <h3 className="font-medium">Personal Procedures</h3>
              <p className="text-sm text-muted-foreground">Версия 1.0.0</p>
              <Badge className="mt-2">Доступно в App Store и Google Play</Badge>
            </div>
            
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Скачать приложение
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">QR-код для скачивания</h3>
              <div className="bg-muted aspect-square rounded-lg flex items-center justify-center">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Отсканируйте QR-код для скачивания
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Функции мобильного приложения</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`mt-0.5 ${feature.available ? 'text-primary' : 'text-muted-foreground'}`}>
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <Badge variant={feature.available ? "default" : "secondary"} className="mt-2">
                    {feature.available ? "Доступно" : "Скоро"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Управление устройствами</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5" />
                <div>
                  <div className="font-medium">iPhone 12 Pro</div>
                  <div className="text-sm text-muted-foreground">
                    Последняя синхронизация: сегодня в 14:30
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Отключить</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5" />
                <div>
                  <div className="font-medium">Samsung Galaxy S21</div>
                  <div className="text-sm text-muted-foreground">
                    Последняя синхронизация: вчера в 09:15
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Отключить</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}