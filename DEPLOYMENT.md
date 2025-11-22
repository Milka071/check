# Инструкция по деплою на Vercel

## Предварительные требования

1. **Аккаунт на Vercel**
   - Зарегистрируйтесь на https://vercel.com
   - Подключите ваш GitHub аккаунт

2. **Supabase проект**
   - Убедитесь, что проект Supabase создан и настроен
   - Получите URL и ключи из настроек проекта

## Шаги деплоя

### 1. Подготовка репозитория

```bash
# Убедитесь, что все изменения закоммичены
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Создание проекта на Vercel

1. Перейдите на https://vercel.com/new
2. Выберите ваш GitHub репозиторий
3. Настройте проект:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`

### 3. Настройка переменных окружения

В настройках проекта Vercel добавьте следующие переменные:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Где найти эти значения:**
1. Откройте ваш проект в Supabase Dashboard
2. Перейдите в Settings → API
3. Скопируйте:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Деплой

1. Нажмите кнопку **Deploy**
2. Дождитесь завершения сборки (обычно 2-3 минуты)
3. После успешного деплоя вы получите URL вашего приложения

### 5. Настройка домена (опционально)

1. В настройках проекта Vercel перейдите в раздел **Domains**
2. Добавьте свой домен
3. Настройте DNS записи согласно инструкциям Vercel

## Автоматический деплой

После первоначальной настройки, каждый push в ветку `main` будет автоматически деплоиться на Vercel.

## Проверка после деплоя

1. Откройте URL вашего приложения
2. Проверьте:
   - ✅ Регистрация/вход работает
   - ✅ Создание процедур работает
   - ✅ Календарь отображается корректно
   - ✅ Напоминания настраиваются
   - ✅ Темная тема переключается

## Troubleshooting

### Ошибка сборки
- Проверьте логи сборки в Vercel Dashboard
- Убедитесь, что все зависимости установлены
- Проверьте версию Node.js (должна быть 18+)

### Ошибки подключения к Supabase
- Проверьте правильность переменных окружения
- Убедитесь, что RLS политики настроены корректно
- Проверьте, что URL Supabase доступен

### Проблемы с аутентификацией
- В настройках Supabase Auth добавьте URL вашего Vercel приложения в список разрешенных URL
- Перейдите в Authentication → URL Configuration
- Добавьте: `https://your-app.vercel.app`

## Мониторинг

- Логи доступны в Vercel Dashboard → Deployments → Logs
- Аналитика доступна в разделе Analytics
- Ошибки отслеживаются в разделе Errors

## Обновление приложения

```bash
# Внесите изменения
git add .
git commit -m "Update feature"
git push origin main

# Vercel автоматически задеплоит изменения
```

## Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
