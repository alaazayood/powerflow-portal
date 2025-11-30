# دليل الرفع والتشغيل (Deployment Guide) - PowerFlow Portal

هذا الدليل يشرح خطوة بخطوة كيفية رفع المشروع على سيرفر خاص (VPS) وربطه بدومين الشركة.

## المتطلبات المسبقة (Prerequisites)
1.  **حساب GitHub:** يجب أن يكون كود المشروع مرفوعاً على GitHub (Private Repo).
2.  **الوصول للدومين:** صلاحية الدخول للوحة تحكم الدومين `powerflowstudio.com` (لإضافة Subdomain).
3.  **سيرفر (VPS):** سنقوم بشراء سيرفر بسيط (تكلفته حوالي 5-6 دولار شهرياً).

---

## الخطوة 1: حجز السيرفر (VPS)
أنصح باستخدام **DigitalOcean** أو **Hetzner** أو **AWS Lightsail**.
1.  قم بإنشاء حساب جديد.
2.  أنشئ سيرفر جديد (**Create Droplet** في DigitalOcean).
3.  اختر المواصفات:
    *   **OS:** Ubuntu 22.04 (LTS) x64.
    *   **Plan:** Basic (أرخص خيار يكفي حالياً، 1GB RAM / 1 CPU).
    *   **Location:** اختر أقرب مكان لعملائك (مثلاً Frankfurt أو London).
4.  بعد الإنشاء، ستحصل على **IP Address** للسيرفر (مثلاً `165.22.xx.xx`) وكلمة مرور `root`.

---

## الخطوة 2: ربط الدومين (DNS)
1.  اذهب للوحة تحكم الدومين (حيث اشتريت الدومين `powerflowstudio.com`).
2.  ابحث عن إعدادات **DNS Management**.
3.  أضف سجلاً جديداً (Add Record):
    *   **Type:** A Record
    *   **Name (Host):** `portal` (ليصبح الرابط `portal.powerflowstudio.com`)
    *   **Value (Points to):** ضع عنوان الـ IP الخاص بالسيرفر الذي حجزته في الخطوة 1.
    *   **TTL:** Automatic أو 1 Hour.

---

## الخطوة 3: إعداد السيرفر (تجهيز البيئة)
الآن سنقوم بالدخول للسيرفر وتثبيت البرامج الضرورية. افتح التيرمينال في جهازك واكتب:
```bash
ssh root@YOUR_SERVER_IP
# سيطلب منك كلمة المرور التي وصلتك
```

بعد الدخول، انسخ والصق هذه الأوامر لتحديث السيرفر وتثبيت البرامج:
```bash
# 1. تحديث النظام
sudo apt update && sudo apt upgrade -y

# 2. تثبيت Node.js (الإصدار 18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. تثبيت قاعدة البيانات PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 4. تثبيت Nginx (السيرفر)
sudo apt install -y nginx

# 5. تثبيت PM2 (لإبقاء الباك اند يعمل دائماً)
sudo npm install -g pm2
```

---

## الخطوة 4: إعداد قاعدة البيانات
```bash
# الدخول لحساب بوستجريس
sudo -u postgres psql

# داخل شاشة SQL نفذ الأوامر التالية (غير كلمة المرور 'secret_password' لكلمة قوية):
CREATE DATABASE powerflow_db;
CREATE USER powerflow_user WITH ENCRYPTED PASSWORD 'secret_password';
GRANT ALL PRIVILEGES ON DATABASE powerflow_db TO powerflow_user;
\q
```

---

## الخطوة 5: رفع الكود وتشغيله
```bash
# 1. اذهب للمجلد الرئيسي
cd /var/www

# 2. اسحب المشروع من GitHub (سيطلب منك اسم المستخدم و Token)
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git powerflow-portal

# 3. إعداد الباك اند
cd /var/www/powerflow-portal/backend
npm install
# أنشئ ملف .env وضع فيه إعدادات السيرفر
nano .env
# (الصق محتويات ملف .env الخاص بك هنا مع تعديل رابط الداتابيز)
# DATABASE_URL="postgresql://powerflow_user:secret_password@localhost:5432/powerflow_db"

# تشغيل الباك اند
npx prisma migrate deploy
npm run build
pm2 start dist/index.js --name "powerflow-backend"

# 4. إعداد الفرونت اند
cd /var/www/powerflow-portal/frontend
npm install
npm run build
# سيقوم بإنشاء مجلد اسمه dist يحتوي على الموقع الجاهز
```

---

## الخطوة 6: إعداد Nginx (الربط النهائي)
```bash
# حذف الإعداد الافتراضي
sudo rm /etc/nginx/sites-enabled/default

# إنشاء إعداد جديد
sudo nano /etc/nginx/sites-available/powerflow
```

الصق المحتوى التالي داخل الملف:
```nginx
server {
    listen 80;
    server_name portal.powerflowstudio.com;

    # Frontend
    location / {
        root /var/www/powerflow-portal/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

ثم فعل الإعداد وأعد تشغيل Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/powerflow /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## كيف تقوم بالتحديثات مستقبلاً؟ (Workflow)
عندما يطلب منك العميل تعديلاً:
1.  عدل الكود على جهازك وتأكد منه.
2.  ارفعه لـ GitHub:
    ```bash
    git add .
    git commit -m "New changes"
    git push
    ```
3.  ادخل للسيرفر واسحب التحديثات:
    ```bash
    ssh root@YOUR_IP
    cd /var/www/powerflow-portal
    git pull
    
    # إذا كان التعديل في الباك اند:
    cd backend && npm run build && pm2 restart powerflow-backend
    
    # إذا كان التعديل في الفرونت اند:
    cd frontend && npm run build
    ```
