import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Health Check Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      color: white;
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    .header p {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a202c;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-healthy {
      background: #d1fae5;
      color: #047857;
    }

    .status-unhealthy {
      background: #fee2e2;
      color: #dc2626;
    }

    .status-degraded {
      background: #fef3c7;
      color: #d97706;
    }

    .status-checking {
      background: #e0e7ff;
      color: #4f46e5;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .card-content {
      font-size: 0.875rem;
      color: #4b5563;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .metric:last-child {
      border-bottom: none;
    }

    .metric-label {
      font-weight: 500;
    }

    .metric-value {
      font-family: 'Courier New', monospace;
      color: #1f2937;
    }

    .btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition: background 0.2s;
      margin-right: 10px;
    }

    .btn:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #6b7280;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .actions {
      margin-top: 20px;
      text-align: center;
    }

    .code-block {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-top: 12px;
      overflow-x: auto;
    }

    .code-block pre {
      font-family: 'Courier New', monospace;
      font-size: 0.75rem;
      color: #1f2937;
    }

    .timestamp {
      text-align: center;
      color: white;
      margin-top: 20px;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 Health Check Dashboard</h1>
      <p>Real-time application health monitoring</p>
    </div>

    <div class="grid">
      <!-- Basic Health -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Basic Health</h2>
          <span id="basic-status" class="status-badge status-checking">Checking...</span>
        </div>
        <div class="card-content">
          <div id="basic-content">
            <div class="metric">
              <span class="metric-label">Loading...</span>
            </div>
          </div>
          <button class="btn" onclick="checkHealth('basic')">Refresh</button>
        </div>
      </div>

      <!-- Detailed Health -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Detailed Check</h2>
          <span id="detailed-status" class="status-badge status-checking">Checking...</span>
        </div>
        <div class="card-content">
          <div id="detailed-content">
            <div class="metric">
              <span class="metric-label">Loading...</span>
            </div>
          </div>
          <button class="btn" onclick="checkHealth('detailed')">Refresh</button>
        </div>
      </div>

      <!-- Liveness -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Liveness Probe</h2>
          <span id="live-status" class="status-badge status-checking">Checking...</span>
        </div>
        <div class="card-content">
          <div id="live-content">
            <div class="metric">
              <span class="metric-label">Loading...</span>
            </div>
          </div>
          <button class="btn" onclick="checkHealth('live')">Refresh</button>
        </div>
      </div>

      <!-- Readiness -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Readiness Probe</h2>
          <span id="ready-status" class="status-badge status-checking">Checking...</span>
        </div>
        <div class="card-content">
          <div id="ready-content">
            <div class="metric">
              <span class="metric-label">Loading...</span>
            </div>
          </div>
          <button class="btn" onclick="checkHealth('ready')">Refresh</button>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn" onclick="checkAllHealth()">🔄 Refresh All</button>
      <button class="btn btn-secondary" onclick="toggleAutoRefresh()">
        <span id="auto-refresh-text">🔄 Enable Auto-Refresh</span>
      </button>
    </div>

    <div class="timestamp">
      Last updated: <span id="last-updated">Never</span>
    </div>
  </div>

  <script>
    let autoRefreshInterval = null;

    const endpoints = {
      basic: '/api/health',
      detailed: '/api/health/detailed',
      live: '/api/health/live',
      ready: '/api/health/ready'
    };

    function updateStatus(type, data, error = false) {
      const statusEl = document.getElementById(\`\${type}-status\`);
      const contentEl = document.getElementById(\`\${type}-content\`);

      if (error) {
        statusEl.className = 'status-badge status-unhealthy';
        statusEl.textContent = 'Error';
        contentEl.innerHTML = \`<div class="metric"><span class="metric-label">Error: \${data}</span></div>\`;
        return;
      }

      const status = data.status || 'unknown';
      statusEl.className = \`status-badge status-\${status}\`;
      statusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);

      let html = '';

      if (type === 'basic' || type === 'detailed') {
        html += \`<div class="metric"><span class="metric-label">Uptime</span><span class="metric-value">\${Math.round(data.uptime)}s</span></div>\`;
        html += \`<div class="metric"><span class="metric-label">Database</span><span class="metric-value">\${data.checks?.database?.status || 'unknown'}</span></div>\`;

        if (data.checks?.database?.responseTime) {
          html += \`<div class="metric"><span class="metric-label">DB Response</span><span class="metric-value">\${data.checks.database.responseTime}ms</span></div>\`;
        }

        if (type === 'detailed' && data.memory) {
          html += \`<div class="metric"><span class="metric-label">Heap Used</span><span class="metric-value">\${data.memory.heapUsed}MB</span></div>\`;
          html += \`<div class="metric"><span class="metric-label">RSS</span><span class="metric-value">\${data.memory.rss}MB</span></div>\`;
        }

        if (type === 'detailed' && data.checks?.database?.details) {
          const details = data.checks.database.details;
          html += \`<div class="metric"><span class="metric-label">Users</span><span class="metric-value">\${details.userCount || 0}</span></div>\`;
          html += \`<div class="metric"><span class="metric-label">Workflows</span><span class="metric-value">\${details.workflowCount || 0}</span></div>\`;
        }
      } else {
        html += \`<div class="metric"><span class="metric-label">Status</span><span class="metric-value">\${data.status}</span></div>\`;
        html += \`<div class="metric"><span class="metric-label">Timestamp</span><span class="metric-value">\${new Date(data.timestamp).toLocaleTimeString()}</span></div>\`;
      }

      contentEl.innerHTML = html;
    }

    async function checkHealth(type) {
      const statusEl = document.getElementById(\`\${type}-status\`);
      statusEl.className = 'status-badge status-checking';
      statusEl.textContent = 'Checking...';

      try {
        const response = await fetch(endpoints[type]);
        const data = await response.json();
        updateStatus(type, data);
      } catch (error) {
        updateStatus(type, error.message, true);
      }
    }

    async function checkAllHealth() {
      document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
      await Promise.all([
        checkHealth('basic'),
        checkHealth('detailed'),
        checkHealth('live'),
        checkHealth('ready')
      ]);
    }

    function toggleAutoRefresh() {
      const btn = document.getElementById('auto-refresh-text');

      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        btn.textContent = '🔄 Enable Auto-Refresh';
      } else {
        autoRefreshInterval = setInterval(checkAllHealth, 5000);
        btn.textContent = '⏸️ Disable Auto-Refresh';
        checkAllHealth();
      }
    }

    // Initial load
    checkAllHealth();
  </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
