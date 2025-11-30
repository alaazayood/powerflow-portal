# PowerFlow Portal

نظام PowerFlow Portal هو تطبيق ويب متكامل لإدارة العمليات (مثل تسجيل العملاء، لوحة التحكم، وإدارة المستخدمين). يعتمد النظام على معمارية حديثة تفصل بين الواجهة الأمامية (Frontend) والواجهة الخلفية (Backend).

## 📚 التوثيق التفصيلي (Documentation)
للمزيد من التفاصيل، يرجى مراجعة الملفات التالية في مجلد `documentation`:

- **[نظرة عامة على المشروع (Project Overview)](documentation/PROJECT_OVERVIEW.md)**: شرح مفصل للمشروع والمعمارية والميزات.
- **[دليل الإعداد (Setup Guide)](documentation/SETUP_GUIDE.md)**: خطوات تفصيلية لتثبيت وتشغيل المشروع محلياً.
- **[وثائق الـ API (API Documentation)](documentation/API_DOCUMENTATION.md)**: تفاصيل نقاط الاتصال (Endpoints) وكيفية استخدامها.
- **[مخطط قاعدة البيانات (Database Schema)](documentation/DATABASE_SCHEMA.md)**: شرح جداول قاعدة البيانات والعلاقات بينها.
- **[تدفق المصادقة (Auth Flow)](documentation/AUTH_FLOW.md)**: شرح آلية التسجيل والدخول والتحقق.
- **[دليل النشر (Deployment Guide)](documentation/DEPLOYMENT.md)**: كيفية رفع المشروع على بيئة الإنتاج.

---

## 🛠 التقنيات المستخدمة (Technology Stack)

### الواجهة الخلفية (Backend)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL
- **ORM/Query Builder:** Knex.js
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, Rate Limiting

### الواجهة الأمامية (Frontend)
- **Framework:** React.js
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **UI Library:** Material UI (MUI)
- **HTTP Client:** Axios
- **Routing:** React Router

---

## 🚀 بداية سريعة (Quick Start)

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd powerflow-portal
```

### 2. تشغيل الـ Backend
```bash
cd backend
npm install
cp env.example .env # (تأكد من إعداد قاعدة البيانات)
npx knex migrate:latest
npm run dev
```

### 3. تشغيل الـ Frontend
```bash
cd frontend
npm install
npm start
```
