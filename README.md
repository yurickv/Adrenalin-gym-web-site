# Adrenalin Next - Gym & Fitness Platform

[🇺🇦 Українська](#українська) | [🇬🇧 English](#english)

---

## Українська

### Опис проекту

**Adrenalin Next** - це комплексна веб-платформа для фітнес-центру, яка надає:
- 📚 Безкоштовні навчальні матеріали для початківців
- 🧮 Інтерактивні калькулятори здоров'я
- 📝 Блог про фітнес та здоровий спосіб життя
- 💪 Інформацію про послуги тренажерного залу

**Веб-сайт:** [https://gym-adrenalin.com.ua](https://gym-adrenalin.com.ua)

### Ключові можливості

#### 📖 Навчальні матеріали (/learn)
Повноцінний безкоштовний посібник для початківців, організований у 4 категорії:

- **Вступ** - перші кроки у світі фітнесу
- **Тренування** - розминка, базові вправи, прогресія навантаження
- **Харчування** - основи харчування, дієти для схуднення/набору ваги
- **Відновлення** - важливість відпочинку, профілактика перетренованості
- **Мотивація** - подолання страхів, пошук мотивації, розвиток дисципліни

#### 🧮 Калькулятори здоров'я (/calcs)
Інтерактивні інструменти для розрахунку:

- **ІМТ (Індекс маси тіла)** - визначення нормальної ваги
- **Процент жиру в тілі** - оцінка складу тіла
- **Денна норма калорій** - розрахунок калорійності раціону

#### 📝 Блог (/blog)
Динамічний блог з постами про фітнес, які завантажуються з MongoDB

#### 💼 Послуги (/services)
Інформація про послуги тренажерного залу та система бронювання

### Технічний стек

- **Framework:** Next.js 14 (App Router)
- **Runtime:** Node.js 20.x
- **Мова:** TypeScript 5.1.6
- **UI:** React 18.2.0
- **Стилізація:** Tailwind CSS 3.3.3
- **База даних:** MongoDB з Mongoose 8.0.1
- **Аутентифікація:** NextAuth 4.24.5
- **Форми:** React Hook Form 7.46.1 + Yup
- **Анімації:** Framer Motion 10.16.4
- **Іконки:** Lucide React 0.284.0
- **Хмарне сховище:** Google Cloud Storage 7.0.1

### Структура проекту

```
app/
├── learn/              # Навчальні матеріали
│   ├── intro/         # Вступ
│   ├── training/      # Тренування
│   ├── nutrition/     # Харчування
│   ├── recover/       # Відновлення
│   └── motivation/    # Мотивація
├── calcs/             # Калькулятори
│   ├── imt-calculator/
│   ├── fat-calculator/
│   └── calories-calculator/
├── blog/              # Блог (динамічний роутинг)
├── services/          # Послуги
└── contacts/          # Контакти
```

### Команди розробки

```bash
# Встановлення залежностей
npm install

# Запуск development сервера
npm run dev

# Збірка для production
npm run build

# Запуск production сервера
npm start

# Перевірка коду
npm run lint
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

### Особливості архітектури

- ✅ Next.js App Router (не Pages Router)
- ✅ Ієрархічна організація контенту з вкладеними маршрутами
- ✅ Динамічне завантаження постів блогу з бази даних
- ✅ Server-side rendering (SSR) для SEO
- ✅ Автоматична генерація sitemap.xml
- ✅ Google Analytics інтеграція
- ✅ Адаптивний дизайн для всіх пристроїв

### Змінні оточення

Створіть файл `.env.local`:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google Cloud Storage
GCS_PROJECT_ID=your_project_id
GCS_BUCKET_NAME=your_bucket_name

# Google Analytics
GTM_ID=your_gtm_id
```

### Ліцензія

Цей проект є приватним і призначений для використання тренажерним залом Adrenalin.

---

## English

### Project Description

**Adrenalin Next** is a comprehensive web platform for a fitness center that provides:
- 📚 Free educational materials for beginners
- 🧮 Interactive health calculators
- 📝 Fitness and healthy lifestyle blog
- 💪 Gym services information

**Website:** [https://gym-adrenalin.com.ua](https://gym-adrenalin.com.ua)

### Key Features

#### 📖 Educational Materials (/learn)
Complete free guide for beginners, organized into 4 categories:

- **Introduction** - first steps in fitness
- **Training** - warm-up, basic exercises, load progression
- **Nutrition** - nutrition basics, diets for weight loss/gain
- **Recovery** - importance of rest, overtraining prevention
- **Motivation** - overcoming fears, finding motivation, building discipline

#### 🧮 Health Calculators (/calcs)
Interactive tools to calculate:

- **BMI (Body Mass Index)** - determine healthy weight
- **Body Fat Percentage** - assess body composition
- **Daily Calorie Intake** - calculate diet caloric needs

#### 📝 Blog (/blog)
Dynamic blog with fitness posts loaded from MongoDB

#### 💼 Services (/services)
Gym services information and booking system

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Runtime:** Node.js 20.x
- **Language:** TypeScript 5.1.6
- **UI:** React 18.2.0
- **Styling:** Tailwind CSS 3.3.3
- **Database:** MongoDB with Mongoose 8.0.1
- **Authentication:** NextAuth 4.24.5
- **Forms:** React Hook Form 7.46.1 + Yup
- **Animations:** Framer Motion 10.16.4
- **Icons:** Lucide React 0.284.0
- **Cloud Storage:** Google Cloud Storage 7.0.1

### Project Structure

```
app/
├── learn/              # Educational materials
│   ├── intro/         # Introduction
│   ├── training/      # Training
│   ├── nutrition/     # Nutrition
│   ├── recover/       # Recovery
│   └── motivation/    # Motivation
├── calcs/             # Calculators
│   ├── imt-calculator/
│   ├── fat-calculator/
│   └── calories-calculator/
├── blog/              # Blog (dynamic routing)
├── services/          # Services
└── contacts/          # Contacts
```

### Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Architecture Features

- ✅ Next.js App Router (not Pages Router)
- ✅ Hierarchical content organization with nested routes
- ✅ Dynamic blog posts loading from database
- ✅ Server-side rendering (SSR) for SEO
- ✅ Automatic sitemap.xml generation
- ✅ Google Analytics integration
- ✅ Responsive design for all devices

### Environment Variables

Create `.env.local` file:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google Cloud Storage
GCS_PROJECT_ID=your_project_id
GCS_BUCKET_NAME=your_bucket_name

# Google Analytics
GTM_ID=your_gtm_id
```

### License

This project is private and intended for use by Adrenalin Gym.

---

**Made with ❤️ for fitness enthusiasts**
