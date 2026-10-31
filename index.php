<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <title>BATAKGO - Portal Edukasi & API Budaya</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      margin: 0;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: #1e293b;
      border-radius: 16px;
      padding: 24px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      border: 1px solid #334155;
    }
    @media (min-width: 640px) {
      .card { padding: 32px; }
    }
    h1 {
      margin-top: 0;
      color: #f59e0b;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 24px;
    }
    p { color: #94a3b8; line-height: 1.6; font-size: 14px; }
    .badge {
      background: #059669;
      color: #fff;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    }
    .links {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-top: 24px;
    }
    @media (min-width: 480px) {
      .links { grid-template-columns: 1fr 1fr; }
    }
    .btn {
      display: block;
      text-align: center;
      padding: 14px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      transition: 0.2s;
    }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { background: #334155; color: #f8fafc; }
    .btn-secondary:hover { background: #475569; }
    .status {
      margin-top: 24px;
      padding: 16px;
      background: #0f172a;
      border-radius: 8px;
      border: 1px solid #334155;
      font-size: 13px;
      color: #cbd5e1;
      line-height: 1.8;
    }
    .status code { color: #38bdf8; word-break: break-all; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🧣 BATAKGO <span class="badge">Online</span></h1>
    <p>Parsiajaran Hata Batak Interaktif & Open Cultural API • Karya Web UINIC 8.0</p>
    
    <div class="links">
      <a href="http://localhost:3000" class="btn btn-primary">🚀 Buka App (Vite Dev Port 3000)</a>
      <a href="http://localhost:8000/api/v1/open/dictionary" target="_blank" class="btn btn-secondary">🌐 Test Backend API (Port 8000)</a>
    </div>

    <div class="status">
      <div>🗄️ Database: <code>batakgo_db (MySQL Laragon)</code></div>
      <div>⚡ Backend API: <code>http://localhost:8000/api/</code></div>
      <div>🖥️ Frontend App: <code>http://localhost:3000</code></div>
      <div>📱 Akses Handphone (Wi-Fi): <code>http://192.168.1.6:3000</code></div>
    </div>
  </div>
</body>
</html>
