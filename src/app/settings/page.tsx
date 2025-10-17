"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Настройки</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Уведомления</CardTitle>
            <CardDescription>
              Настройте уведомления о процедурах
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Вечерние напоминания</Label>
                <p className="text-sm text-muted-foreground">
                  Напоминания о подготовке к следующему дню
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Утренние напоминания</Label>
                <p className="text-sm text-muted-foreground">
                  Напоминания о начале запланированных процедур
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label>Время вечернего напоминания</Label>
              <Select defaultValue="21:00">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                  <SelectItem value="21:00">21:00</SelectItem>
                  <SelectItem value="22:00">22:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Интеграции</CardTitle>
            <CardDescription>
              Подключение к сторонним сервисам
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Яндекс.Станция</Label>
                <p className="text-sm text-muted-foreground">
                  Управление умными устройствами
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="space-y-2">
              <Label>API ключ Яндекс.Станции</Label>
              <Input placeholder="Введите ваш API ключ" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Внешний вид</CardTitle>
            <CardDescription>
              Настройки интерфейса приложения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Тема</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="dark">Темная</SelectItem>
                  <SelectItem value="system">Системная</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Аккаунт</CardTitle>
            <CardDescription>
              Управление вашим аккаунтом
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="user@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label>Имя</Label>
              <Input placeholder="Ваше имя" />
            </div>
            
            <Button>Сохранить изменения</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}