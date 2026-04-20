import React, { useState, useEffect } from 'react';
import { Wallet, Users, Building2, Shield, Clock, TrendingUp, Plus, LayoutDashboard, CreditCard, PackageSearch, AlertCircle, ShoppingCart, Loader2, Trash2, Edit2, CheckCircle, XCircle, Sparkles, MapPin, BarChart2, Activity, MessageSquare, LogOut, FileText, ClipboardList, CheckSquare, UploadCloud, Calendar, Zap, AlertTriangle, Database } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';
import { CareWalletTab } from '../components/shared/CareWalletTab';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { turso } from '../lib/turso';
import { initializeDatabase } from '../lib/tursoMigrations';
import { ComplianceEngineTab } from '../components/business/ComplianceEngineTab';

// Simple Button mock
const Button = ({ children, className, icon: Icon, variant, disabled, ...props }: any) => (
  <button disabled={disabled} className={cn("inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm border transition-all disabled:opacity-50", 
    variant === "outline" ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50" : "bg-[#1a4731] text-white border-transparent hover:bg-[#153a28]",
    className)} {...props}>
    {Icon && <Icon size={14} />} {children}
  </button>
);
