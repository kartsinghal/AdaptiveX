import { useState } from 'react';
import { Bell, Moon, Shield, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdaptive } from '../context/AdaptiveContext';
import { useIntersection } from '../hooks/useIntersection';
import {
  BarChart3, Users, CreditCard, LayoutDashboard,
  TrendingUp, Star, ArrowUpRight,
  DollarSign, UserCheck, Receipt, Activity,
} from 'lucide-react';
import { cn } from '../utils/cn';
import type { SectionId } from '../hooks/useIntelligence';
import React from 'react';

interface DashboardPreviewProps {
  topSection: SectionId | null;
  onInteract: (id: SectionId) => void;
  preloadingSection: SectionId | null;
}

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview',  id: 'overview'  },
  { icon: Users,           label: 'Clients',   id: 'clients'   },
  { icon: BarChart3,       label: 'Analytics', id: 'analytics' },
  { icon: CreditCard,      label: 'Billing',   id: 'billing'   },
  { icon: TrendingUp,      label: 'Growth',    id: 'growth'    },
];

/* ── Tab content panels ─────────────────────────────────── */

const OverviewPanel = ({ isExpanded, isCompact }: { isExpanded: boolean; isCompact: boolean }) => (
  <div className="flex flex-col gap-5">
    <div className="flex justify-between items-center bg-white/4 px-4 py-3 rounded-2xl border border-white/8">
      <div>
        <h3 className={cn('font-bold text-white', isExpanded ? 'text-xl' : 'text-base')}>Project Success</h3>
        <p className="text-xs text-zinc-500">Real-time performance metrics</p>
      </div>
      {isExpanded && (
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
        </div>
      )}
    </div>
    <div className={cn('grid gap-4', isCompact ? 'grid-cols-2' : isExpanded ? 'grid-cols-3' : 'grid-cols-2')}>
      <StatCard title="Revenue"    value="$124.5K" trend="+14%" color="emerald" expanded={isExpanded} />
      <StatCard title="Clients"    value="842"     trend="+5%"  color="blue"    expanded={isExpanded} />
      {!isCompact && <StatCard title="Conversion" value="4.2%"  trend="+1.2%" color="violet" expanded={isExpanded} />}
    </div>
    <div className={cn('rounded-2xl border border-white/8 overflow-hidden relative', isExpanded ? 'p-5' : 'p-4', isCompact ? 'p-3' : '')}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-white">Engagement Analytics</span>
        {isExpanded && (
          <div className="flex gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500 inline-block" /> Revenue</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Clients</span>
          </div>
        )}
      </div>
      <div className={cn('w-full bg-black/30 rounded-xl relative overflow-hidden', isCompact ? 'h-24' : isExpanded ? 'h-52' : 'h-36')}>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-600/20 to-transparent" />
        <svg className="absolute bottom-0 w-full h-[80%]" preserveAspectRatio="none" viewBox="0 0 200 100">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f55c00" />
              <stop offset="100%" stopColor="#f97c21" />
            </linearGradient>
          </defs>
          <path d="M0,100 C30,80 50,90 80,40 C110,10 140,60 170,20 L200,30 L200,100 Z" fill="rgba(245, 92, 0, 0.35)" />
          {isExpanded && <path d="M0,100 C40,90 60,60 100,70 C130,60 160,40 200,30 L200,100 Z" fill="rgba(59, 130, 246, 0.2)" />}
          <path d="M0,100 C30,80 50,90 80,40 C110,10 140,60 170,20 L200,30" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />
        </svg>
      </div>
    </div>
  </div>
);

const ClientsPanel = () => {
  const clients = [
    { name: 'Acme Corp',      email: 'acme@corp.com',      status: 'Active',   value: '$12,400', avatar: 'AC' },
    { name: 'Globex Inc',     email: 'hello@globex.io',    status: 'Active',   value: '$9,800',  avatar: 'GI' },
    { name: 'Initech Ltd',    email: 'info@initech.com',   status: 'Pending',  value: '$5,200',  avatar: 'IL' },
    { name: 'Umbrella Co',    email: 'ops@umbrella.net',   status: 'Inactive', value: '$3,100',  avatar: 'UC' },
    { name: 'Stark Industries','email': 'tony@stark.com',  status: 'Active',   value: '$28,900', avatar: 'SI' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-white text-base">Client Directory</h3>
        <span className="text-xs text-brand-400 font-mono bg-brand-500/10 px-2 py-1 rounded-full">842 total</span>
      </div>
      <div className="flex flex-col gap-2">
        {clients.map((c) => (
          <div key={c.name} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/4 border border-white/8 hover:border-brand-500/30 hover:bg-white/6 transition-all cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0">{c.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{c.name}</div>
              <div className="text-xs text-zinc-500 truncate">{c.email}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full',
                c.status === 'Active'   ? 'bg-emerald-500/15 text-emerald-400' :
                c.status === 'Pending'  ? 'bg-amber-500/15 text-amber-400' :
                                          'bg-zinc-500/15 text-zinc-500')}>{c.status}</span>
              <span className="text-sm font-bold text-white">{c.value}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-brand-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsPanel = () => (
  <div className="flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-white text-base">Analytics Overview</h3>
      <span className="text-xs text-zinc-500 font-mono">Last 30 days</span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Page Views',    value: '1.24M', icon: Activity,   color: 'brand'   },
        { label: 'Avg Session',   value: '4m 32s', icon: UserCheck,  color: 'blue'    },
        { label: 'Bounce Rate',   value: '28.4%',  icon: TrendingUp, color: 'emerald' },
        { label: 'Conversions',   value: '3,812',  icon: BarChart3,  color: 'violet'  },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="p-4 rounded-2xl bg-white/4 border border-white/8 hover:border-white/15 transition-all cursor-pointer">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3',
            color === 'brand'   ? 'bg-brand-500/15'   :
            color === 'blue'    ? 'bg-blue-500/15'    :
            color === 'emerald' ? 'bg-emerald-500/15' : 'bg-violet-500/15')}>
            <Icon className={cn('w-4 h-4',
              color === 'brand'   ? 'text-brand-400'   :
              color === 'blue'    ? 'text-blue-400'    :
              color === 'emerald' ? 'text-emerald-400' : 'text-violet-400')} />
          </div>
          <div className="text-xl font-black text-white">{value}</div>
          <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
        </div>
      ))}
    </div>
    <div className="p-4 rounded-2xl bg-white/4 border border-white/8">
      <div className="text-sm font-semibold text-white mb-3">Traffic Sources</div>
      {[
        { source: 'Organic Search', pct: 42, color: 'bg-brand-500' },
        { source: 'Direct',         pct: 28, color: 'bg-blue-500'  },
        { source: 'Referral',       pct: 18, color: 'bg-violet-500'},
        { source: 'Social',         pct: 12, color: 'bg-emerald-500'},
      ].map(({ source, pct, color }) => (
        <div key={source} className="flex items-center gap-3 mb-2">
          <span className="text-xs text-zinc-400 w-28 shrink-0">{source}</span>
          <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-mono text-zinc-400 w-8 text-right">{pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

const BillingPanel = () => (
  <div className="flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-white text-base">Billing & Invoices</h3>
      <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded-full">$124.5K collected</span>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'MRR',      value: '$18.2K', icon: DollarSign, color: 'emerald' },
        { label: 'Invoices', value: '142',    icon: Receipt,    color: 'blue'    },
        { label: 'Overdue',  value: '3',      icon: CreditCard, color: 'red'     },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="p-3 rounded-xl bg-white/4 border border-white/8 flex flex-col gap-2">
          <Icon className={cn('w-4 h-4', color === 'emerald' ? 'text-emerald-400' : color === 'blue' ? 'text-blue-400' : 'text-red-400')} />
          <div className="text-xl font-black text-white">{value}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</div>
        </div>
      ))}
    </div>
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Recent Transactions</div>
      {[
        { label: 'Acme Corp — Pro Plan',   amount: '+$1,200', date: 'Apr 18', status: 'Paid'    },
        { label: 'Globex Inc — Enterprise',amount: '+$3,400', date: 'Apr 17', status: 'Paid'    },
        { label: 'Initech — Starter',      amount: '+$299',   date: 'Apr 15', status: 'Pending' },
        { label: 'Umbrella Co — Refund',   amount: '-$500',   date: 'Apr 14', status: 'Refund'  },
      ].map((t) => (
        <div key={t.label} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/4 border border-white/8 hover:border-white/15 transition-all">
          <div>
            <div className="text-sm text-white font-medium">{t.label}</div>
            <div className="text-xs text-zinc-500">{t.date}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full',
              t.status === 'Paid'    ? 'bg-emerald-500/15 text-emerald-400' :
              t.status === 'Pending' ? 'bg-amber-500/15 text-amber-400' :
                                       'bg-red-500/15 text-red-400')}>{t.status}</span>
            <span className={cn('text-sm font-bold', t.amount.startsWith('-') ? 'text-red-400' : 'text-emerald-400')}>{t.amount}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SettingsPanel = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [editing, setEditing] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className="transition-colors">
      {value
        ? <ToggleRight className="w-8 h-8 text-brand-400" />
        : <ToggleLeft className="w-8 h-8 text-zinc-600" />}
    </button>
  );

  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-bold text-white text-base">Settings</h3>

      {/* Profile */}
      <div className="p-4 rounded-2xl bg-white/4 border border-white/8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-lg font-black text-brand-400 shrink-0">
          {userName ? userName.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className="w-full text-sm bg-white/8 border border-white/15 rounded-lg px-3 py-1.5 text-white placeholder-zinc-600 outline-none focus:border-brand-500/50"
              />
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full text-xs bg-white/8 border border-white/15 rounded-lg px-3 py-1.5 text-zinc-300 placeholder-zinc-600 outline-none focus:border-brand-500/50"
              />
            </div>
          ) : (
            <>
              <div className="text-sm font-semibold text-white truncate">{userName || <span className="text-zinc-500 italic">No name set</span>}</div>
              <div className="text-xs text-zinc-500 truncate">{userEmail || 'No email set'}</div>
            </>
          )}
        </div>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-xs px-3 py-1.5 rounded-lg bg-white/8 text-zinc-300 hover:bg-white/15 border border-white/10 transition-all shrink-0"
        >
          {editing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* Preferences */}
      <div className="p-4 rounded-2xl bg-white/4 border border-white/8 flex flex-col gap-4">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2"><Bell className="w-3.5 h-3.5" /> Preferences</div>
        {[
          { label: 'Push Notifications', desc: 'Receive alerts for key events', value: notifications, toggle: () => setNotifications(v => !v) },
          { label: 'Dark Mode',          desc: 'Use dark theme across the app',  value: darkMode,       toggle: () => setDarkMode(v => !v)       },
          { label: 'Analytics Sharing',  desc: 'Help us improve with usage data',value: analytics,      toggle: () => setAnalytics(v => !v)      },
        ].map(({ label, desc, value, toggle }) => (
          <div key={label} className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white font-medium">{label}</div>
              <div className="text-xs text-zinc-500">{desc}</div>
            </div>
            <Toggle value={value} onChange={toggle} />
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="p-4 rounded-2xl bg-white/4 border border-white/8 flex flex-col gap-3">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Security</div>
        <button className="text-sm text-white px-3 py-2 rounded-xl bg-white/6 hover:bg-white/10 border border-white/10 transition-all text-left">Change Password</button>
        <button className="text-sm text-white px-3 py-2 rounded-xl bg-white/6 hover:bg-white/10 border border-white/10 transition-all text-left">Two-Factor Authentication</button>
      </div>

      {/* Danger zone */}
      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-red-400 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete Account</div>
          <div className="text-xs text-zinc-500 mt-0.5">Permanently remove all data</div>
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 transition-all">Delete</button>
      </div>
    </div>
  );
};

const GrowthPanel = () => (
  <div className="flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-white text-base">Growth Metrics</h3>
      <span className="text-xs text-brand-400 font-mono bg-brand-500/10 px-2 py-1 rounded-full">↑ 22% MoM</span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'New Signups',  value: '284',   trend: '+22%', color: 'brand'   },
        { label: 'Churn Rate',   value: '1.8%',  trend: '-0.4%',color: 'emerald' },
        { label: 'LTV',          value: '$4,820', trend: '+11%', color: 'blue'    },
        { label: 'NPS Score',    value: '74',    trend: '+6',   color: 'violet'  },
      ].map(({ label, value, trend, color }) => (
        <div key={label} className="p-4 rounded-2xl bg-white/4 border border-white/8 hover:border-white/15 transition-all cursor-pointer">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{label}</div>
          <div className="text-2xl font-black text-white">{value}</div>
          <div className={cn('text-xs font-semibold mt-1',
            color === 'brand'   ? 'text-brand-400'   :
            color === 'emerald' ? 'text-emerald-400' :
            color === 'blue'    ? 'text-blue-400'    : 'text-violet-400')}>{trend}</div>
        </div>
      ))}
    </div>
    <div className="p-4 rounded-2xl bg-white/4 border border-white/8">
      <div className="text-sm font-semibold text-white mb-3">Monthly Signups</div>
      <div className="flex items-end gap-1.5 h-24">
        {[30, 45, 38, 60, 52, 70, 65, 80, 74, 90, 85, 100].map((h, i) => (
          <div key={i} className="flex-1 bg-brand-500/20 rounded-t hover:bg-brand-500/40 transition-colors relative group" style={{ height: `${h}%` }}>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-brand-400 opacity-0 group-hover:opacity-100 whitespace-nowrap">{h}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-zinc-600 mt-1 font-mono">
        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  </div>
);

/* ── Main component ─────────────────────────────────────── */

export const DashboardPreview = ({ topSection, onInteract, preloadingSection }: DashboardPreviewProps) => {
  const { layoutDensity, activeMode, animationsEnabled } = useAdaptive();
  const { ref, isVisible } = useIntersection(0.15);
  const [activeTab, setActiveTab] = useState('overview');

  const isCompact  = layoutDensity === 'compact';
  const isExpanded = layoutDensity === 'expanded';
  const isHighlighted = topSection === 'dashboard';

  const renderContent = () => {
    switch (activeTab) {
      case 'clients':   return <ClientsPanel />;
      case 'analytics': return <AnalyticsPanel />;
      case 'billing':   return <BillingPanel />;
      case 'growth':    return <GrowthPanel />;
      default:          return <OverviewPanel isExpanded={isExpanded} isCompact={isCompact} />;
    }
  };

  return (
    <section
      id="dashboard"
      ref={ref}
      className="w-full max-w-6xl mx-auto px-4"
      onMouseEnter={() => onInteract('dashboard')}
      onClick={() => onInteract('dashboard')}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Dynamic UX Morphing
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Layout That Responds</h2>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm">
          Switch between Performance / Balanced / Quality — watch layout density, sidebar visibility, and content richness change in real-time.
        </p>
      </motion.div>

      <motion.div
        key={activeMode}
        initial={{ opacity: 0, y: -8 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <div className={cn('px-4 py-1.5 rounded-full text-xs font-mono font-semibold border',
          activeMode === 'performance' && 'bg-brand-500/15 border-brand-500/30 text-brand-400',
          activeMode === 'balanced'    && 'bg-blue-500/15   border-blue-500/30   text-blue-400',
          activeMode === 'quality'     && 'bg-violet-500/15 border-violet-500/30 text-violet-400',
        )}>
          {activeMode === 'performance' && '⚡ Compact layout · Sidebar hidden · Minimal shadows'}
          {activeMode === 'balanced'    && '⚖ Comfortable layout · Core content visible'}
          {activeMode === 'quality'     && '✦ Expanded layout · Full sidebar · Rich glassmorphism'}
        </div>
      </motion.div>

      <motion.div
        layout={animationsEnabled}
        initial={{ opacity: 0, y: 32 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={cn(
          'relative rounded-3xl overflow-hidden glass card-hover transition-all duration-700',
          isExpanded  && 'p-8 shadow-[0_0_80px_-15px_rgba(139,92,246,0.2)] border-violet-500/15',
          !isExpanded && !isCompact && 'p-6 border-white/8',
          isCompact   && 'p-4 border-white/5',
          isHighlighted && 'border-brand-500/30 glow-sm'
        )}
      >
        <AnimatePresence>
          {preloadingSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 glass-strong rounded-full border border-brand-500/30 text-[11px] font-mono text-brand-400 flex items-center gap-2"
            >
              <span className="animate-pulse">⟳</span> Predictively preloading dashboard…
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn('grid gap-6 transition-all duration-700',
          isExpanded ? 'grid-cols-4' : isCompact ? 'grid-cols-1' : 'grid-cols-3'
        )}>
          {/* Sidebar */}
          <AnimatePresence>
            {!isCompact && (
              <motion.aside
                key="sidebar"
                initial={{ opacity: 0, x: -24, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -24, width: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-3 border-r border-white/8 pr-5 col-span-1"
              >
                <div className="text-gradient font-black text-xl mb-4">AdaptiveX</div>
                {SIDEBAR_ITEMS.map(({ icon: Icon, label, id }) => (
                  <SidebarItem
                    key={id}
                    icon={<Icon className="w-4 h-4" />}
                    label={label}
                    active={activeTab === id}
                    onClick={() => setActiveTab(id)}
                  />
                ))}

              </motion.aside>
            )}
          </AnimatePresence>

          {/* Content area */}
          <motion.div
            layout={animationsEnabled}
            className={cn('flex flex-col gap-5', isExpanded ? 'col-span-3' : isCompact ? 'col-span-1' : 'col-span-2')}
          >
            {/* Mobile tab bar (compact mode) */}
            {isCompact && (
              <div className="flex gap-1 overflow-x-auto pb-1">
                {SIDEBAR_ITEMS.map(({ icon: Icon, label, id }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                      activeTab === id
                        ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

/* ── Sub-components ─────────────────────────────────────── */

const SidebarItem = ({
  icon, label, active = false, onClick,
}: {
  icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group',
      active
        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
    )}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const StatCard = ({ title, value, trend, color, expanded }: {
  title: string; value: string; trend: string; color: string; expanded: boolean;
}) => {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400',
    blue:    'text-blue-400',
    violet:  'text-violet-400',
  };
  return (
    <div className="p-4 rounded-2xl bg-white/4 border border-white/8 flex flex-col gap-2 card-hover cursor-pointer">
      <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{title}</span>
      <div className="flex items-end gap-2">
        <span className={cn('font-black text-white tracking-tight', expanded ? 'text-3xl' : 'text-2xl')}>{value}</span>
        <span className={cn('text-xs font-semibold mb-0.5', colorMap[color])}>{trend}</span>
      </div>
      {expanded && (
        <div className="h-1 w-full bg-white/5 rounded-full mt-1">
          <div className={cn('h-full rounded-full bg-current', colorMap[color])} style={{ width: '68%' }} />
        </div>
      )}
    </div>
  );
};
