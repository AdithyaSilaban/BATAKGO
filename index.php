<!DOCTYPE html>
<html lang=" id\>
<head>
 <meta charset=\UTF-8\>
 <meta name=\viewport\ content=\width=device-width initial-scale=1.0\>
 <title>BATAKGO - Portal</title>
 <style>
 body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
 .card { background: #1e293b; border-radius: 16px; padding: 32px; max-width: 640px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid #334155; }
 h1 { margin-top: 0; color: #f59e0b; display: flex; align-items: center; gap: 12px; }
 p { color: #94a3b8; line-height: 1.6; }
 .badge { background: #059669; color: #fff; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
 .links { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
 .btn { display: block; text-align: center; padding: 14px 20px; border-radius: 10px; font-weight: 600; text-decoration: none; transition: 0.2s; }
 .btn-primary { background: #2563eb; color: #fff; }
 .btn-primary:hover { background: #1d4ed8; }
 .btn-secondary { background: #334155; color: #f8fafc; }
 .btn-secondary:hover { background: #475569; }
 .status { margin-top: 24px; padding: 16px; background: #0f172a; border-radius: 8px; border: 1px solid #334155; font-size: 13px; color: #cbd5e1; }
 .status code { color: #38bdf8; }
 </style>
</head>
<body>
 <div class=\card\>
 <h1>🧣 BATAKGO <span class=\badge\>Online</span></h1>
 <p>Parsiajaran Hata Batak Interaktif & Open Cultural API (UINIC 8.0).</p>
 
 <div class=\links\>
 <a href=\/frontend/dist/index.html\ class=\btn btn-primary\>🚀 Buka Frontend SPA</a>
 <a href=\/backend/public/api/v1/open/dictionary\ target=\_blank\ class=\btn btn-secondary\>🌐 Test Open API</a>
 </div>

 <div class=\status\>
 <div>🗄️ Database: <code>batakgo_db (MySQL Laragon)</code></div>
 <div>⚡ Backend API: <code>/backend/public/api/</code></div>
 <div>🖥️ Frontend: <code>React 19 + TypeScript + Vite</code></div>
 </div>
 </div>
</body>
</html>
