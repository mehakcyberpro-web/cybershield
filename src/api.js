const API_ROOT = '/api';

export function readSession() {
  try { return JSON.parse(sessionStorage.getItem('cybershield-session') || 'null'); }
  catch { return null; }
}

function saveSession(data) {
  sessionStorage.setItem('cybershield-token', data.token);
  const session = { token: data.token, user: data.user };
  sessionStorage.setItem('cybershield-session', JSON.stringify(session));
  return session;
}

export async function login(email, password) {
  const response = await fetch(`${API_ROOT}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Sign-in failed.');
  return saveSession(data);
}

export async function demoLogin(role) {
  const response = await fetch(`${API_ROOT}/auth/demo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Demo sign-in failed.');
  return saveSession(data);
}

export function logout() {
  sessionStorage.removeItem('cybershield-token');
  sessionStorage.removeItem('cybershield-session');
}

async function request(path, options = {}) {
  let token = sessionStorage.getItem('cybershield-token');
  if (!token) throw new Error('Please sign in to continue.');
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `API request failed (${response.status})`);
  return data;
}

export const api = {
  health: async () => { const response = await fetch(`${API_ROOT}/health`); if (!response.ok) throw new Error('API health check failed'); return response.json(); },
  incidents: () => request('/incidents'),
  createIncident: incident => request('/incidents', { method: 'POST', body: JSON.stringify(incident) }),
  updateIncident: (id, changes) => request(`/incidents/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  queueAgent: (agentPath, incidentId, target) => request(`/agents/${agentPath}`, { method: 'POST', body: JSON.stringify({ incidentId, target }) }),
};

export function toIncident(row) {
  const assignee = row.assignee_code || ({ 'Alex Rivera':'AR', 'Jordan Davis':'JD', 'Morgan Kim':'MK', 'Sam Lee':'SL', 'Maya Chen':'MC' }[row.assignee_name] || '—');
  const date = row.created_at ? new Date(row.created_at) : new Date();
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  const time = minutes < 1 ? 'Just now' : minutes < 60 ? `${minutes} min ago` : minutes < 1440 ? `${Math.floor(minutes / 60)} hr ago` : 'Yesterday';
  return { id: row.incident_key || String(row.id), recordId: row.id, title: row.title, type: row.category || 'Security incident', severity: row.severity, status: row.status, assignee, reporter: row.reporter_name || 'Security team', time, target: row.affected_asset || 'Unspecified', description: row.description || '', score: row.score ?? 50 };
}
