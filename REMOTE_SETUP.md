# Remote Server Deployment Guide

Since you cannot copy-paste easily, here are the short, exact commands to run on the Remote Desktop.

## Phase 1: Update Code (Force Sync)
Open PowerShell and run these commands one by one:

1.  Go to project folder:
    ```powershell
    cd C:\Users\Administrator\Desktop\powerflow-portal
    ```

2.  **CRITICAL STEP:** Force the code to match your local computer (deletes "Blackbox" changes):
    ```powershell
    git fetch --all
    git reset --hard origin/master
    git pull
    ```

## Phase 2: Update Backend
3.  Update Backend dependencies and database:
    ```powershell
    cd backend
    npm install
    npx prisma generate
    npm run build
    ```

4.  Restart Backend Server:
    ```powershell
    pm2 restart all
    ```
    *(If pm2 is not installed, use: `npm run start`)*

## Phase 3: Update Frontend
5.  Build the new Frontend:
    ```powershell
    cd ../frontend
    npm install
    npm run build
    ```

## Phase 4: Verify
6.  Open the site in the browser and check:
    - Login
    - Dashboard (Dark Theme)
    - Profile Page
    - Settings Page

## Troubleshooting
- If you get "Permission denied" errors, close any open VS Code windows or Node processes on the remote server.
- If `git pull` fails, run `git reset --hard origin/master` again.
