import { useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Github, LockKeyhole, Mail, Shield, ShieldCheck, UserRound, Users, BriefcaseBusiness } from 'lucide-react';
import { demoLogin, login } from './api.js';
import './login.css';

const roles = [
  { id: 'admin', label: 'Administrator', short: 'Admin', description: 'Workspace, users, incidents, and reports', icon: ShieldCheck, color: 'green' },
  { id: 'analyst', label: 'Security analyst', short: 'Analyst', description: 'Triage, investigate, assign, and run agents', icon: BriefcaseBusiness, color: 'blue' },
  { id: 'reporter', label: 'Incident reporter', short: 'Reporter', description: 'Submit and follow your own reports', icon: UserRound, color: 'amber' },
  { id: 'viewer', label: 'Read-only viewer', short: 'Viewer', description: 'Review dashboards and incident details', icon: Eye, color: 'violet' },
];

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => { fetch('/api/health').then(response => response.json()).then(data => setDemoMode(data.mode === 'demo-memory')).catch(() => setDemoMode(false)); }, []);

  const handleLogin = async action => {
    setBusy(true); setError('');
    try { onLogin(await action()); }
    catch (err) { setError(err.message || 'Could not sign in. Check your details and try again.'); }
    finally { setBusy(false); }
  };

  return <main className="login-page"><div className="login-glow glow-one"/><div className="login-glow glow-two"/><section className="login-story"><div className="login-brand"><span className="login-brand-icon"><Shield size={20}/></span><span>cyber<span>shield</span></span></div><div className="story-copy"><div className="story-eyebrow"><span/> SECURITY OPERATIONS PLATFORM</div><h1>See the signal.<br/><span>Protect what matters.</span></h1><p>One place for your team to report, investigate, and resolve security incidents.</p><div className="story-points"><div><span><ShieldCheck size={16}/></span><div><b>One clear response workflow</b><small>From first report through resolution</small></div></div><div><span><Users size={16}/></span><div><b>Access for every role</b><small>Right tools for the right people</small></div></div><div><span><LockKeyhole size={16}/></span><div><b>Built for secure operations</b><small>Audited actions and role-based access</small></div></div></div></div><div className="story-foot">CYBERSHIELD <span>·</span> INCIDENT RESPONSE <a href="https://github.com/mehakcyberpro-web/cybershield" target="_blank" rel="noreferrer" aria-label="View CyberShield on GitHub"><Github size={13}/> GitHub</a></div></section>
    <section className="login-side"><div className="login-card"><div className="mobile-brand"><span className="login-brand-icon"><Shield size={19}/></span><span>cyber<span>shield</span></span></div><div className="login-heading"><div className="login-kicker">WELCOME BACK</div><h2>Sign in to your workspace</h2><p>Use your organization account to continue.</p></div><form className="login-form" onSubmit={event=>{event.preventDefault();handleLogin(()=>login(email,password))}}><label>Email address<span className="login-input"><Mail size={16}/><input type="email" autoComplete="username" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@organization.com"/></span></label><label>Password<span className="login-input"><LockKeyhole size={16}/><input type={showPassword?'text':'password'} autoComplete="current-password" required value={password} onChange={event=>setPassword(event.target.value)} placeholder="Enter your password"/><button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<EyeOff size={15}/>:<Eye size={15}/>}</button></span></label><div className="login-options"><label><input type="checkbox"/> Keep me signed in</label><button type="button" onClick={()=>setError('Ask your workspace administrator to reset your password.')}>Forgot password?</button></div>{error&&<div className="login-error" role="alert">{error}</div>}<button className="login-submit" type="submit" disabled={busy}>{busy?'Signing in…':'Sign in'}{!busy&&<ArrowRight size={16}/>}</button></form>
      {demoMode&&<><div className="login-divider"><span/>OR EXPLORE A DEMO ROLE<span/></div><div className="role-grid">{roles.map(role=><button key={role.id} className="role-card" onClick={()=>handleLogin(()=>demoLogin(role.id))} disabled={busy}><span className={`role-icon ${role.color}`}><role.icon size={17}/></span><span className="role-copy"><b>{role.short}</b><small>{role.description}</small></span><ArrowRight size={14} className="role-arrow"/></button>)}</div><p className="demo-caption">Demo access uses sample data. Choose a role to preview its view.</p></>}
      <div className="login-legal">Protected workspace access <span>·</span> CyberShield</div></div><div className="login-side-footer">Need access? <span>Contact your workspace administrator.</span></div></section></main>;
}
