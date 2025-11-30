# إعداد المشروع على السيرفر البعيد (Remote Desktop)

هذا الملف يحتوي على الخطوات الدقيقة لتشغيل المشروع على الجهاز الجديد.

## 1. سحب المشروع (Clone)
افتح التيرمينال (PowerShell) في المجلد الذي تريد وضع المشروع فيه ونفذ:

```powershell
git clone https://github.com/YOUR_USERNAME/powerflow-studio-portal.git .
```
*(استبدل `YOUR_USERNAME` باسم حسابك على GitHub)*

---

## 2. إعداد الباك اند (Backend)
```powershell
cd backend

# 1. تثبيت المكتبات
npm install

# 2. بناء ملفات بريزما (هام جداً لحل مشاكل قاعدة البيانات)
npx prisma generate

# 3. إعداد ملف البيئة
# قم بإنشاء ملف اسمه .env وانسخ محتوياته من جهازك الأصلي
# تأكد من أن رابط قاعدة البيانات DATABASE_URL صحيح
```

---

## 3. إعداد الفرونت اند (Frontend)
افتح تيرمينال جديد (أو عد للمجلد الرئيسي `cd ..`) ثم:

```powershell
cd frontend

# 1. تثبيت المكتبات
npm install

# 2. تشغيل المشروع للتجربة
npm start
```
