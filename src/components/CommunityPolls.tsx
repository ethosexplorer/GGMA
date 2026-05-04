import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vote,
  ChevronRight,
  ChevronLeft,
  Heart,
  Leaf,
  BarChart3,
  Users,
  Globe,
  Sparkles,
  ArrowRight,
  X,
  MessageCircle,
  TrendingUp,
  Zap,
  Shield, CircleCheck } from 'lucide-react';
import { turso } from '../lib/turso';

// ─── Poll Types ───
interface PollOption {
  id: string;
  label: string;
  emoji?: string;
  votes: number;
}

interface Poll {
  id: string;
  category: 'healing' | 'education' | 'demographics' | 'growth' | 'support' | 'economic' | 'legal' | 'political' | 'culture' | 'business' | 'lifestyle';
  question: string;
  subtitle?: string;
  options: PollOption[];
  allowMultiple?: boolean;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  didYouKnow?: string;
  actionItem?: string;
  deadline?: string;
}

// ─── Poll Data ───
const POLLS: Poll[] = [
  // ─── 🚨 BREAKING NEWS POLLS (FIRST) ───
  { id: 'federal_reschedule', category: 'legal', question: '🚨 BREAKING: Cannabis rescheduled from Schedule I to Schedule III — What does this mean for Oklahoma?', subtitle: 'The federal government has officially moved marijuana from Schedule I (alongside heroin) to Schedule III. OBN Director Donnie Anderson says this "opens opportunities for tax breaks and banking options."', icon: <Zap size={20} />, color: 'red', bgGradient: 'from-red-600 to-rose-800', didYouKnow: 'Schedule III means cannabis businesses will NO LONGER be penalized under IRS Code 280E — which previously prevented them from deducting normal business expenses. This could save Oklahoma businesses $50M+ annually.', actionItem: 'Contact your representative to support the SAFE Banking Act — which would give cannabis businesses full access to banking services alongside rescheduling.', deadline: 'SAFE Banking vote expected: Summer 2026', options: [
    { id: 'game_changer', label: 'Game changer — finally legitimate', emoji: '🎉', votes: 4567 },
    { id: 'good_start', label: 'Good start, but full legalization needed', emoji: '📈', votes: 3234 },
    { id: 'helps_business', label: 'Great for business — tax relief is huge', emoji: '💼', votes: 2876 },
    { id: 'more_research', label: 'Opens up much-needed clinical research', emoji: '🔬', votes: 1987 },
    { id: 'concerned', label: 'Concerned about more federal oversight', emoji: '😟', votes: 876 },
    { id: 'other', label: 'Other (comment below)', emoji: '💬', votes: 432 },
  ]},
  { id: 'ok_enforcement', category: 'legal', question: 'Oklahoma went from 8,400 cannabis farms to fewer than 1,400 — Is the crackdown working?', subtitle: 'OBN MET agents have seized 2.2M illegal plants, 290,000 lbs of processed marijuana, and made 400+ arrests since 2021. Many operations were tied to black market trafficking and straw ownership schemes.', icon: <Shield size={20} />, color: 'amber', bgGradient: 'from-amber-600 to-orange-800', didYouKnow: 'California has only 4,800 licensed grows with 10x Oklahoma\'s population. Oklahoma\'s pre-crackdown number of 8,400 was considered extremely high by industry standards.', actionItem: 'If you suspect illegal cannabis operations, report anonymously to OBN\'s tip-line: 800-522-8031', options: [
    { id: 'necessary', label: 'Necessary — illegal ops hurt legitimate businesses', emoji: '✅', votes: 2345 },
    { id: 'too_aggressive', label: 'Too aggressive — hurting small legal growers', emoji: '😰', votes: 1876 },
    { id: 'right_direction', label: 'Right direction but needs more transparency', emoji: '🎯', votes: 1654 },
    { id: 'ptsd_access', label: 'Focus on patient access, not just enforcement', emoji: '💚', votes: 2134 },
    { id: 'veterans', label: 'Prioritize veterans & first responder access', emoji: '🇺🇸', votes: 1987 },
    { id: 'other', label: 'Other (comment below)', emoji: '💬', votes: 321 },
  ]},
  {
    id: 'natural_healing',
    category: 'healing',
    question: 'Do you believe cannabis is a natural source of healing with minimal side effects?',
    subtitle: 'Medical cannabis has shown therapeutic benefits across dozens of conditions.',
    icon: <Heart size={20} />,
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-green-600',
    options: [
      { id: 'strongly_agree', label: 'Strongly Agree', emoji: '💚', votes: 1847 },
      { id: 'agree', label: 'Agree', emoji: '✅', votes: 1234 },
      { id: 'neutral', label: 'Neutral / Need More Info', emoji: '🤔', votes: 523 },
      { id: 'disagree', label: 'Disagree', emoji: '❌', votes: 187 },
      { id: 'strongly_disagree', label: 'Strongly Disagree', emoji: '🚫', votes: 89 },
    ]
  },
  {
    id: 'medical_conditions',
    category: 'healing',
    question: 'Which conditions do you believe benefit most from medical cannabis?',
    subtitle: 'Select all that apply — your voice helps shape medical research priorities.',
    icon: <Leaf size={20} />,
    color: 'teal',
    bgGradient: 'from-teal-500 to-cyan-600',
    allowMultiple: true,
    options: [
      { id: 'chronic_pain', label: 'Chronic Pain', emoji: '🦴', votes: 2134 },
      { id: 'anxiety_ptsd', label: 'Anxiety / PTSD', emoji: '🧠', votes: 1876 },
      { id: 'cancer_chemo', label: 'Cancer / Chemotherapy', emoji: '🎗️', votes: 1654 },
      { id: 'epilepsy', label: 'Epilepsy / Seizures', emoji: '⚡', votes: 1432 },
      { id: 'insomnia', label: 'Insomnia / Sleep Disorders', emoji: '😴', votes: 1298 },
      { id: 'inflammation', label: 'Inflammation / Arthritis', emoji: '🔥', votes: 1187 },
      { id: 'mental_health', label: 'Depression / Mental Health', emoji: '💜', votes: 987 },
      { id: 'other', label: 'Other (comment below)', emoji: '📝', votes: 345 },
    ]
  },
  {
    id: 'education_level',
    category: 'education',
    question: 'How would you rate your knowledge of medical cannabis?',
    subtitle: 'Education is the foundation of responsible cannabis policy.',
    icon: <Sparkles size={20} />,
    color: 'purple',
    bgGradient: 'from-purple-500 to-indigo-600',
    options: [
      { id: 'expert', label: 'Expert — I work in the industry', emoji: '🎓', votes: 567 },
      { id: 'well_informed', label: 'Well-Informed — I research regularly', emoji: '📚', votes: 1123 },
      { id: 'somewhat', label: 'Somewhat Informed', emoji: '📖', votes: 1456 },
      { id: 'learning', label: 'Just Starting to Learn', emoji: '🌱', votes: 987 },
      { id: 'uninformed', label: 'I want to learn more', emoji: '🔍', votes: 654 },
    ]
  },
  {
    id: 'age_group',
    category: 'demographics',
    question: 'What is your age group?',
    subtitle: 'Understanding demographics helps us serve all communities better.',
    icon: <Users size={20} />,
    color: 'sky',
    bgGradient: 'from-sky-500 to-blue-600',
    options: [
      { id: '18_24', label: '18 – 24', emoji: '🌱', votes: 432 },
      { id: '25_34', label: '25 – 34', emoji: '🌿', votes: 876 },
      { id: '35_44', label: '35 – 44', emoji: '🌳', votes: 1123 },
      { id: '45_54', label: '45 – 54', emoji: '🏡', votes: 987 },
      { id: '55_64', label: '55 – 64', emoji: '🌻', votes: 654 },
      { id: '65_plus', label: '65+', emoji: '🌾', votes: 345 },
    ]
  },
  {
    id: 'med_vs_rec',
    category: 'support',
    question: 'Do you support medical cannabis programs over recreational legalization?',
    subtitle: 'Medical programs ensure patient safety, quality control, and responsible access.',
    icon: <TrendingUp size={20} />,
    color: 'amber',
    bgGradient: 'from-amber-500 to-orange-600',
    options: [
      { id: 'medical_only', label: 'Yes — Medical programs with proper oversight', emoji: '🏥', votes: 2345 },
      { id: 'medical_first', label: 'Medical first, then evaluate', emoji: '📋', votes: 1234 },
      { id: 'both', label: 'Support both equally', emoji: '⚖️', votes: 876 },
      { id: 'recreational', label: 'Prefer recreational approach', emoji: '🌿', votes: 432 },
      { id: 'neither', label: 'Neither / Undecided', emoji: '🤷', votes: 198 },
    ]
  },
  {
    id: 'side_effects',
    category: 'healing',
    question: 'Compared to traditional pharmaceuticals, do you believe cannabis has fewer side effects?',
    subtitle: 'Millions of Americans take medications with significant side effects daily.',
    icon: <Zap size={20} />,
    color: 'rose',
    bgGradient: 'from-rose-500 to-pink-600',
    options: [
      { id: 'much_fewer', label: 'Significantly fewer side effects', emoji: '💚', votes: 1987 },
      { id: 'somewhat_fewer', label: 'Somewhat fewer', emoji: '✅', votes: 1345 },
      { id: 'comparable', label: 'About the same', emoji: '↔️', votes: 567 },
      { id: 'more_research', label: 'Need more research', emoji: '🔬', votes: 876 },
      { id: 'more_effects', label: 'Cannabis has more side effects', emoji: '⚠️', votes: 123 },
    ]
  },
  {
    id: 'nationality_background',
    category: 'demographics',
    question: 'Which background best describes you?',
    subtitle: 'Cannabis healing crosses all cultures. Every voice matters.',
    icon: <Globe size={20} />,
    color: 'indigo',
    bgGradient: 'from-indigo-500 to-violet-600',
    options: [
      { id: 'african_american', label: 'African American / Black', emoji: '✊🏿', votes: 876 },
      { id: 'hispanic_latino', label: 'Hispanic / Latino', emoji: '🌎', votes: 1234 },
      { id: 'caucasian', label: 'Caucasian / White', emoji: '🤝', votes: 1456 },
      { id: 'asian', label: 'Asian / Pacific Islander', emoji: '🌏', votes: 543 },
      { id: 'middle_eastern', label: 'Middle Eastern / North African', emoji: '🌍', votes: 234 },
      { id: 'multiracial', label: 'Multiracial / Other', emoji: '🌈', votes: 567 },
      { id: 'prefer_not', label: 'Prefer not to say', emoji: '🔒', votes: 345 },
    ]
  },
  {
    id: 'growth_priority',
    category: 'growth',
    question: 'What should be the #1 priority for the medical cannabis industry?',
    subtitle: 'Help shape the future of responsible, patient-first cannabis policy.',
    icon: <BarChart3 size={20} />,
    color: 'emerald',
    bgGradient: 'from-emerald-600 to-teal-700',
    options: [
      { id: 'patient_access', label: 'Expanding patient access', emoji: '🏥', votes: 1876 },
      { id: 'research', label: 'More clinical research', emoji: '🔬', votes: 1543 },
      { id: 'affordability', label: 'Making it affordable', emoji: '💰', votes: 1234 },
      { id: 'education', label: 'Public education & destigmatization', emoji: '📚', votes: 1098 },
      { id: 'quality', label: 'Quality control & lab testing', emoji: '🧪', votes: 876 },
      { id: 'equity', label: 'Social equity & inclusion', emoji: '⚖️', votes: 654 },
    ]
  },
  // ─── ECONOMIC ───
  { id: 'econ_jobs', category: 'economic', question: 'Should your state invest in cannabis industry job training programs?', subtitle: 'The cannabis industry created 440,000+ jobs nationwide in 2025.', icon: <TrendingUp size={20} />, color: 'emerald', bgGradient: 'from-green-500 to-emerald-700', didYouKnow: 'Oklahoma\'s medical cannabis industry generates over $1.5B in annual revenue and employs 30,000+ workers.', actionItem: 'Contact your state representative to support HB 2742 (Cannabis Workforce Development Act).', deadline: 'Committee vote: May 15, 2026', options: [
    { id: 'strongly_yes', label: 'Absolutely — jobs are the priority', emoji: '💼', votes: 2134 },
    { id: 'yes_targeted', label: 'Yes, especially in underserved areas', emoji: '🎯', votes: 1567 },
    { id: 'private_sector', label: 'Let the private sector handle it', emoji: '🏢', votes: 876 },
    { id: 'not_sure', label: 'Need more information', emoji: '🤔', votes: 432 },
  ]},
  { id: 'econ_tax', category: 'economic', question: 'Where should cannabis tax revenue go?', subtitle: 'States collected $3.7B in cannabis tax revenue in 2025 — where should YOUR state put it?', icon: <BarChart3 size={20} />, color: 'amber', bgGradient: 'from-amber-500 to-yellow-600', didYouKnow: 'Colorado has collected over $2.1B in cannabis tax revenue since 2014 — funding schools, roads, and public health.', options: [
    { id: 'education', label: 'Public education & schools', emoji: '🏫', votes: 2345 },
    { id: 'healthcare', label: 'Healthcare & mental health', emoji: '🏥', votes: 1876 },
    { id: 'infrastructure', label: 'Roads & infrastructure', emoji: '🛣️', votes: 987 },
    { id: 'equity', label: 'Social equity programs', emoji: '⚖️', votes: 1234 },
    { id: 'law_enforcement', label: 'Drug prevention & treatment', emoji: '🛡️', votes: 654 },
  ]},
  { id: 'econ_small_biz', category: 'business', question: 'Is it too expensive for small businesses to enter the cannabis industry?',  subtitle: 'Average dispensary startup costs range from $150K-$500K before opening.', icon: <BarChart3 size={20} />, color: 'violet', bgGradient: 'from-violet-500 to-purple-700', didYouKnow: 'Oklahoma has the most cannabis licenses per capita of any state — but 40% of licensees report difficulty accessing banking.', actionItem: 'Support the SAFE Banking Act (HR 2891) to give cannabis businesses access to normal banking.', deadline: 'Senate vote expected: Summer 2026', options: [
    { id: 'way_too_high', label: 'Way too expensive — shuts out minorities', emoji: '🚫', votes: 1987 },
    { id: 'high_but_worth', label: 'High but worth the investment', emoji: '📈', votes: 1234 },
    { id: 'reasonable', label: 'Reasonable for the industry', emoji: '✅', votes: 432 },
    { id: 'lower_barriers', label: 'States should lower barriers', emoji: '🔓', votes: 1876 },
  ]},
  // ─── LEGAL & POLITICAL ───
  { id: 'legal_federal', category: 'legal', question: 'Should cannabis be rescheduled from Schedule I at the federal level?', subtitle: 'DEA currently classifies cannabis alongside heroin. The rescheduling process is underway.', icon: <Zap size={20} />, color: 'blue', bgGradient: 'from-blue-600 to-indigo-800', didYouKnow: 'In August 2023, HHS recommended rescheduling cannabis to Schedule III. The DEA is reviewing this recommendation.', actionItem: 'Write to your congressperson supporting the MORE Act or STATES Act.', deadline: 'DEA final rule expected: Q3 2026', options: [
    { id: 'deschedule', label: 'Remove from scheduling entirely', emoji: '🗽', votes: 2456 },
    { id: 'schedule3', label: 'Move to Schedule III (medical)', emoji: '📋', votes: 1876 },
    { id: 'states_decide', label: 'Let each state decide', emoji: '🏛️', votes: 1345 },
    { id: 'keep_schedule1', label: 'Keep current classification', emoji: '🔒', votes: 234 },
  ]},
  { id: 'legal_expungement', category: 'legal', question: 'Should people with past cannabis convictions have their records expunged?', subtitle: '40,000+ Americans are currently incarcerated for cannabis offenses.', icon: <Heart size={20} />, color: 'rose', bgGradient: 'from-rose-500 to-red-700', didYouKnow: '6.5 million Americans have been arrested for cannabis since 2001. Black Americans are 3.7x more likely to be arrested despite equal usage rates.', actionItem: 'Support the Cannabis Justice Act in your state legislature — check if your state has an expungement bill pending.', options: [
    { id: 'yes_all', label: 'Yes — expunge all cannabis records', emoji: '💚', votes: 2876 },
    { id: 'yes_nonviolent', label: 'Yes, but only non-violent offenses', emoji: '✅', votes: 1654 },
    { id: 'case_by_case', label: 'Review case by case', emoji: '⚖️', votes: 876 },
    { id: 'no', label: 'No — the law was the law', emoji: '🚫', votes: 345 },
  ]},
  { id: 'political_trust', category: 'political', question: 'Do you trust your state legislature to create fair cannabis policy?', subtitle: 'Your voice shapes policy. Tell us how you feel about your state\'s approach.', icon: <Globe size={20} />, color: 'slate', bgGradient: 'from-slate-600 to-slate-800', options: [
    { id: 'strong_trust', label: 'Yes, they\'re doing great', emoji: '🏛️', votes: 567 },
    { id: 'somewhat', label: 'Somewhat — room for improvement', emoji: '🤏', votes: 1876 },
    { id: 'not_really', label: 'Not really — too influenced by lobbyists', emoji: '😐', votes: 2345 },
    { id: 'no_trust', label: 'Not at all — need voter-led reform', emoji: '📢', votes: 1234 },
  ]},
  { id: 'political_vote', category: 'political', question: 'Would a candidate\'s stance on cannabis influence your vote?', icon: <TrendingUp size={20} />, color: 'red', bgGradient: 'from-red-500 to-rose-700', didYouKnow: '68% of Americans now support cannabis legalization — the highest ever recorded (Gallup 2025).', options: [
    { id: 'major_factor', label: 'Yes — it\'s a major factor', emoji: '🗳️', votes: 1987 },
    { id: 'one_of_many', label: 'It\'s one of several important issues', emoji: '📊', votes: 2345 },
    { id: 'minor', label: 'Minor factor', emoji: '🤷', votes: 876 },
    { id: 'no_impact', label: 'Doesn\'t affect my vote', emoji: '❌', votes: 543 },
  ]},
  // ─── CULTURE & LIFESTYLE ───
  { id: 'culture_stigma', category: 'culture', question: 'Has the stigma around cannabis changed in your community?', subtitle: 'Breaking stigma starts with honest conversations. Your answer matters.', icon: <Sparkles size={20} />, color: 'pink', bgGradient: 'from-pink-500 to-fuchsia-600', didYouKnow: 'In 1969, only 12% of Americans supported legalization. Today it\'s 68%. That\'s a generational shift.', options: [
    { id: 'much_better', label: 'Yes — much more accepted now', emoji: '🌈', votes: 2134 },
    { id: 'somewhat_better', label: 'Getting better, slowly', emoji: '🌤️', votes: 1876 },
    { id: 'same', label: 'About the same as always', emoji: '😐', votes: 876 },
    { id: 'still_bad', label: 'Still very stigmatized here', emoji: '🙈', votes: 654 },
    { id: 'worse', label: 'Actually getting worse', emoji: '📉', votes: 123 },
  ]},
  { id: 'culture_gen', category: 'lifestyle', question: 'Which generation do you think is driving cannabis normalization?', icon: <Users size={20} />, color: 'cyan', bgGradient: 'from-cyan-500 to-blue-600', didYouKnow: 'Gen Z (18-25) uses cannabis at lower rates than Millennials but supports legalization at higher rates (79%).', options: [
    { id: 'gen_z', label: 'Gen Z (18–27)', emoji: '📱', votes: 1234 },
    { id: 'millennials', label: 'Millennials (28–43)', emoji: '💻', votes: 2345 },
    { id: 'gen_x', label: 'Gen X (44–59)', emoji: '🎸', votes: 987 },
    { id: 'boomers', label: 'Boomers (60+)', emoji: '✌️', votes: 654 },
    { id: 'all_together', label: 'All generations equally', emoji: '🤝', votes: 1567 },
  ]},
  { id: 'culture_wellness', category: 'lifestyle', question: 'Do you view cannabis as part of a wellness routine — like yoga, meditation, or vitamins?', icon: <Leaf size={20} />, color: 'green', bgGradient: 'from-green-400 to-teal-600', options: [
    { id: 'absolutely', label: 'Yes — it\'s my wellness tool', emoji: '🧘', votes: 1876 },
    { id: 'sometimes', label: 'Sometimes, alongside other practices', emoji: '🌿', votes: 1543 },
    { id: 'medical_only', label: 'Only for medical necessity', emoji: '💊', votes: 1234 },
    { id: 'not_wellness', label: 'No, I don\'t see it that way', emoji: '🤔', votes: 654 },
  ]},
  { id: 'biz_entrepreneur', category: 'business', question: 'Would you start a cannabis business if barriers were lower?', subtitle: 'The cannabis industry is projected to reach $72B by 2030.', icon: <TrendingUp size={20} />, color: 'amber', bgGradient: 'from-amber-400 to-orange-600', didYouKnow: 'Women own only 22% of cannabis businesses. Minority ownership is under 15% in most states.', actionItem: 'Check your state\'s social equity program for reduced licensing fees and mentorship opportunities.', options: [
    { id: 'already_in', label: 'I\'m already in the industry', emoji: '🏪', votes: 567 },
    { id: 'yes_planning', label: 'Yes — I\'m planning to', emoji: '📝', votes: 1234 },
    { id: 'interested', label: 'Interested but barriers are too high', emoji: '🚧', votes: 1876 },
    { id: 'not_interested', label: 'Not interested in cannabis business', emoji: '🤷', votes: 987 },
  ]},
  // ─── 🔒 EXPANDED LEGAL ───
  { id: 'legal_tribal_sovereignty', category: 'legal', question: 'Should tribal nations have independent authority to regulate cannabis on sovereign land?', subtitle: 'Multiple tribes across the US are establishing their own cannabis regulatory frameworks, separate from state law.', icon: <Shield size={20} />, color: 'indigo', bgGradient: 'from-indigo-600 to-purple-800', didYouKnow: 'The Oglala Sioux Tribe and others are asserting sovereignty rights to establish independent cannabis programs — potentially creating a new legal framework nationwide.', actionItem: 'Research your local tribal nation\'s stance on cannabis sovereignty and participate in public comment periods.', options: [
    { id: 'full_sovereignty', label: 'Yes — full tribal authority, no state interference', emoji: '🦅', votes: 1876 },
    { id: 'cooperative', label: 'Cooperative framework with states', emoji: '🤝', votes: 2134 },
    { id: 'federal_oversight', label: 'Federal oversight for consistency', emoji: '🏛️', votes: 987 },
    { id: 'state_law_applies', label: 'State law should apply everywhere', emoji: '📋', votes: 543 },
    { id: 'unsure', label: 'Need more information', emoji: '🤔', votes: 765 },
  ]},
  { id: 'legal_banking_safe', category: 'legal', question: 'Should cannabis businesses have full access to banking and financial services?', subtitle: 'Most cannabis businesses are forced to operate in cash due to federal banking restrictions — creating safety and tax issues.', icon: <TrendingUp size={20} />, color: 'blue', bgGradient: 'from-blue-500 to-cyan-700', didYouKnow: 'Cannabis businesses paid $1.8B in CASH taxes in 2025. Armored trucks, armed guards, and cash-counting rooms are standard operating costs — adding 5-10% to overhead.', actionItem: 'Contact your senator to support the SAFER Banking Act (S.2860) — currently in committee.', deadline: 'Senate Banking Committee vote: June 2026', options: [
    { id: 'full_banking', label: 'Yes — full banking access immediately', emoji: '🏦', votes: 3456 },
    { id: 'limited', label: 'Limited banking until fully legal', emoji: '🔓', votes: 987 },
    { id: 'credit_unions_only', label: 'Allow credit unions, not big banks', emoji: '🏪', votes: 1234 },
    { id: 'no_banking', label: 'No — not until federally legal', emoji: '🚫', votes: 321 },
  ]},
  { id: 'legal_attorney_access', category: 'legal', question: 'Is it too difficult to find affordable cannabis legal counsel?', subtitle: 'Navigating cannabis law requires specialized attorneys — but many charge $400-800/hour.', icon: <Sparkles size={20} />, color: 'amber', bgGradient: 'from-amber-500 to-red-600', didYouKnow: 'Only 2% of licensed attorneys in the US specialize in cannabis law. In Oklahoma, fewer than 50 attorneys actively practice cannabis regulatory law.', actionItem: 'Use GGHP\'s Legal Advocacy Hub to connect with verified, affordable cannabis attorneys.', options: [
    { id: 'very_difficult', label: 'Very difficult — too expensive', emoji: '💸', votes: 2345 },
    { id: 'somewhat', label: 'Somewhat — options are limited', emoji: '😐', votes: 1876 },
    { id: 'ok', label: 'Manageable if you know where to look', emoji: '🔍', votes: 876 },
    { id: 'not_needed', label: 'Haven\'t needed legal counsel yet', emoji: '✌️', votes: 654 },
    { id: 'platform_helps', label: 'Platforms like GGHP make it easier', emoji: '🌿', votes: 1123 },
  ]},
  { id: 'legal_ip_protection', category: 'legal', question: 'Should cannabis strains and products be eligible for federal patent and trademark protection?', subtitle: 'Currently, cannabis businesses cannot register federal trademarks — leaving brands vulnerable to copying.', icon: <Shield size={20} />, color: 'violet', bgGradient: 'from-violet-600 to-purple-800', didYouKnow: 'Without federal trademark protection, anyone can copy a cannabis brand name, logo, or strain name in a different state with no legal recourse.', options: [
    { id: 'full_ip', label: 'Yes — full federal IP protection', emoji: '🛡️', votes: 2134 },
    { id: 'trademarks_only', label: 'Trademarks yes, patents no', emoji: '™️', votes: 1567 },
    { id: 'state_level', label: 'State-level protection is enough', emoji: '🏛️', votes: 876 },
    { id: 'open_source', label: 'Cannabis genetics should be open source', emoji: '🌱', votes: 1234 },
    { id: 'unsure', label: 'Not sure / need more info', emoji: '🤔', votes: 432 },
  ]},
  { id: 'legal_social_equity', category: 'legal', question: 'Should states prioritize cannabis licenses for communities most harmed by the War on Drugs?', subtitle: 'Social equity programs aim to repair decades of disproportionate enforcement in Black and Brown communities.', icon: <Heart size={20} />, color: 'rose', bgGradient: 'from-rose-600 to-pink-800', didYouKnow: 'Despite equal usage rates, Black Americans are 3.7x more likely to be arrested for cannabis. In some counties, the disparity is 10x.', actionItem: 'Check if your state has a Social Equity program and advocate for reduced licensing fees for qualifying applicants.', options: [
    { id: 'absolutely', label: 'Absolutely — it\'s a moral obligation', emoji: '✊', votes: 2876 },
    { id: 'yes_with_limits', label: 'Yes, but with reasonable criteria', emoji: '📋', votes: 1654 },
    { id: 'merit_based', label: 'No — licenses should be merit-based', emoji: '🎯', votes: 987 },
    { id: 'everyone_equal', label: 'Everyone should have equal access', emoji: '⚖️', votes: 1432 },
    { id: 'unsure', label: 'Need more information', emoji: '🤔', votes: 543 },
  ]},
  { id: 'legal_patient_rights', category: 'legal', question: 'Should medical cannabis patients be protected from employment discrimination?', subtitle: 'Many patients lose jobs or face discipline for legal, off-duty cannabis use prescribed by a doctor.', icon: <Shield size={20} />, color: 'emerald', bgGradient: 'from-emerald-600 to-green-800', didYouKnow: 'Only 21 states have employment protections for medical cannabis patients. In Oklahoma, employers can still fire you for a positive drug test — even with a valid OMMA card.', actionItem: 'Support the Oklahoma Patient Employment Protection Act — contact your state representative.', deadline: 'Legislative session: Feb 2027', options: [
    { id: 'full_protection', label: 'Yes — same as any other prescription', emoji: '💚', votes: 3234 },
    { id: 'safety_exceptions', label: 'Yes, except safety-sensitive jobs', emoji: '🦺', votes: 1987 },
    { id: 'employer_choice', label: 'Employers should decide their policy', emoji: '🏢', votes: 876 },
    { id: 'no_protection', label: 'No — employers have the right', emoji: '🚫', votes: 432 },
  ]},
  { id: 'legal_interstate', category: 'legal', question: 'Should legal cannabis be allowed to cross state lines between legal states?', subtitle: 'Currently, transporting cannabis across ANY state line is a federal crime — even between two legal states.', icon: <Globe size={20} />, color: 'blue', bgGradient: 'from-blue-700 to-slate-800', didYouKnow: 'Oregon and Colorado have passed conditional interstate commerce laws that activate once federal law changes. This could create a national cannabis supply chain.', actionItem: 'Support the Cannabis Interstate Commerce Act to enable legal trade between states.', options: [
    { id: 'yes_legal_states', label: 'Yes — between legal states only', emoji: '🚛', votes: 2345 },
    { id: 'yes_all', label: 'Yes — nationwide free commerce', emoji: '🌎', votes: 1876 },
    { id: 'not_yet', label: 'Not until federal legalization', emoji: '⏳', votes: 1234 },
    { id: 'never', label: 'No — keep it state by state', emoji: '🏠', votes: 654 },
  ]},
  { id: 'legal_civil_rights', category: 'legal', question: 'Do you believe cannabis prohibition has been used as a tool for racial and social control?', subtitle: 'The history of cannabis criminalization is deeply tied to racial politics in America.', icon: <Zap size={20} />, color: 'red', bgGradient: 'from-red-700 to-rose-900', didYouKnow: 'Harry Anslinger, the first head of the Federal Bureau of Narcotics, explicitly used racist language to push for cannabis prohibition in the 1930s. Nixon\'s advisor John Ehrlichman later admitted the War on Drugs targeted Black communities and antiwar activists.', options: [
    { id: 'absolutely', label: 'Absolutely — the evidence is clear', emoji: '📜', votes: 2567 },
    { id: 'partially', label: 'Partially — but it\'s evolving', emoji: '🔄', votes: 1876 },
    { id: 'not_anymore', label: 'Maybe historically, but not today', emoji: '🤔', votes: 987 },
    { id: 'disagree', label: 'Disagree — it was about public safety', emoji: '🛡️', votes: 432 },
    { id: 'complex', label: 'Too complex to simplify', emoji: '🧩', votes: 876 },
  ]},
];

// ─── Featured Poll (top banner) ───
export const FeaturedPoll = () => {
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const poll = POLLS[currentPollIndex];
  
  // Load live results from API on mount
  const [liveResults, setLiveResults] = useState<Record<string, Record<string, number>>>({});
  
  useEffect(() => {
    turso.execute('SELECT poll_id, vote_choice as option_id, COUNT(*) as total_votes FROM poll_votes GROUP BY poll_id, vote_choice')
      .then(res => {
        const map: Record<string, Record<string, number>> = {};
        res.rows.forEach(r => {
          const pollId = r.poll_id as string;
          const optionId = r.option_id as string;
          const votes = Number(r.total_votes);
          if (!map[pollId]) map[pollId] = {};
          map[pollId][optionId] = votes;
        });
        setLiveResults(map);
      })
      .catch(() => {});
  }, []);

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes + (liveResults[poll.id]?.[o.id] || 0), 0);
  
  const persistVote = async (pollId: string, optionIds: string[]) => {
    try {
      const sessionId = sessionStorage.getItem('gghp_session') || 
        (() => { const id = 'sess_' + Math.random().toString(36).slice(2); sessionStorage.setItem('gghp_session', id); return id; })();
      const jurisdiction = sessionStorage.getItem('gghp_jurisdiction') || 'Unknown';
      
      const stmts = optionIds.map(opt => ({
        sql: 'INSERT INTO poll_votes (id, poll_id, voter_id, jurisdiction, vote_choice) VALUES (?, ?, ?, ?, ?)',
        args: [`vote_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, pollId, sessionId, jurisdiction, opt]
      }));
      await turso.batch(stmts, 'write');
    } catch (e) {
      console.error('Failed to save vote', e);
    }
  };

  // Auto-rotate every 12 seconds (pauses when user has voted on current poll)
  useEffect(() => {
    if (hasVoted[poll.id]) return;
    const timer = setInterval(() => {
      setCurrentPollIndex(prev => (prev + 1) % POLLS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [currentPollIndex, hasVoted, poll.id]);

  const handleVote = (optionId: string) => {
    if (hasVoted[poll.id]) return;
    const currentSelections = selectedOptions[poll.id] || [];
    if (poll.allowMultiple) {
      if (currentSelections.includes(optionId)) {
        setSelectedOptions({ ...selectedOptions, [poll.id]: currentSelections.filter(id => id !== optionId) });
      } else {
        setSelectedOptions({ ...selectedOptions, [poll.id]: [...currentSelections, optionId] });
      }
    } else {
      setSelectedOptions({ ...selectedOptions, [poll.id]: [optionId] });
      setTimeout(() => {
        setHasVoted({ ...hasVoted, [poll.id]: true });
        persistVote(poll.id, [optionId]);
        // Auto-advance 3s after voting
        setTimeout(() => setCurrentPollIndex(prev => (prev + 1) % POLLS.length), 3000);
      }, 300);
    }
  };

  const submitMultiVote = () => {
    const selections = selectedOptions[poll.id] || [];
    if (selections.length > 0) {
      setHasVoted({ ...hasVoted, [poll.id]: true });
      persistVote(poll.id, selections);
      setTimeout(() => setCurrentPollIndex(prev => (prev + 1) % POLLS.length), 3000);
    }
  };

  const nextPoll = () => setCurrentPollIndex((currentPollIndex + 1) % POLLS.length);
  const prevPoll = () => setCurrentPollIndex((currentPollIndex - 1 + POLLS.length) % POLLS.length);

  if (!isExpanded) {
    return (
      <div className="bg-emerald-950 bg-gradient-to-r from-emerald-950 to-emerald-900 border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2 text-emerald-200 hover:text-white transition-colors text-xs font-bold">
            <Vote size={14} />
            <span>🗳️ Community Voice — Share your opinion on medical cannabis</span>
            <ChevronRight size={14} />
          </button>
          <span className="text-emerald-400 text-[10px] font-bold">{POLLS.length} Active Polls</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-950 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 border-b border-emerald-700/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 relative z-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${poll.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
              {poll.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">🗳️ Community Voice</span>
                <span className="text-[10px] text-emerald-500/60 font-bold">Poll {currentPollIndex + 1} of {POLLS.length}</span>
              </div>
              <p className="text-white font-black text-base leading-tight mt-0.5">{poll.question}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevPoll} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextPoll} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setIsExpanded(false)} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-emerald-300 transition-colors ml-1">
              <X size={14} />
            </button>
          </div>
        </div>

        {poll.subtitle && (
          <p className="text-emerald-300/80 text-xs mb-4 max-w-2xl">{poll.subtitle}</p>
        )}

        {/* Poll Options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
          >
            {poll.options.map((option) => {
              const liveVoteCount = option.votes + (liveResults[poll.id]?.[option.id] || 0);
              const percentage = Math.round((liveVoteCount / totalVotes) * 100) || 0;
              const isSelected = (selectedOptions[poll.id] || []).includes(option.id);
              const voted = hasVoted[poll.id];

              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={voted && !poll.allowMultiple}
                  className={`relative overflow-hidden rounded-xl p-3 text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/30 border-2 border-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                  } ${voted ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {/* Progress bar (shown after voting) */}
                  {voted && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="absolute inset-y-0 left-0 bg-emerald-500/15 rounded-xl"
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-white text-xs font-bold flex-1 leading-tight">{option.label}</span>
                    {voted && (
                      <span className="text-emerald-400 text-xs font-black">{percentage}%</span>
                    )}
                    {isSelected && !voted && (
                      <CircleCheck size={14} className="text-emerald-400" />
                    )}
                  </div>

                  {voted && (
                    <p className="text-[10px] text-emerald-500/60 font-bold mt-1 relative z-10 ml-7">
                      {(liveVoteCount + (isSelected && !voted && !poll.allowMultiple ? 1 : 0)).toLocaleString()} votes
                    </p>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Comment box — shown when 'other' is selected */}
        {(selectedOptions[poll.id] || []).includes('other') && (
          <div className="mt-3 max-w-2xl">
            <textarea
              value={commentText[poll.id] || ''}
              onChange={e => setCommentText({ ...commentText, [poll.id]: e.target.value })}
              placeholder="Share your thoughts... we're listening 💬"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 resize-none"
              rows={2}
            />
          </div>
        )}

        {/* Submit button for multi-select + Stats */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            {poll.allowMultiple && !hasVoted[poll.id] && (selectedOptions[poll.id] || []).length > 0 && (
              <button
                onClick={submitMultiVote}
                className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-400 transition-all shadow-lg"
              >
                Submit Vote ({(selectedOptions[poll.id] || []).length} selected)
              </button>
            )}
            {hasVoted[poll.id] && (
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CircleCheck size={14} /> Thank you for voting!
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-emerald-500/60 font-bold">
            <span>{totalVotes.toLocaleString()} total votes</span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-white/10 rounded-full capitalize">{poll.category}</span>
          </div>
        </div>

        {/* 💡 Did You Know + Action Item — ALWAYS VISIBLE */}
        {(poll.didYouKnow || poll.actionItem) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {poll.didYouKnow && (
              <div className="bg-amber-500 bg-gradient-to-br from-amber-500/15 to-yellow-500/5 border-2 border-amber-400/30 rounded-xl p-4 shadow-lg shadow-amber-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💡</span>
                  <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">Did You Know?</span>
                </div>
                <p className="text-emerald-100 text-xs leading-relaxed">{poll.didYouKnow}</p>
              </div>
            )}
            {poll.actionItem && (
              <div className="bg-emerald-500 bg-gradient-to-br from-emerald-500/15 to-green-500/5 border-2 border-emerald-400/30 rounded-xl p-4 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📢</span>
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Take Action</span>
                </div>
                <p className="text-emerald-100 text-xs leading-relaxed mb-2">{poll.actionItem}</p>
                {poll.deadline && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-400/30 rounded-lg w-fit animate-pulse">
                    <span className="text-sm">⏰</span>
                    <span className="text-[11px] font-black text-red-300">{poll.deadline}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Revolving Survey Banner (Prominent, inline) ───
export const RevolvingSurveyBanner = ({ compact = false }: { compact?: boolean }) => {
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});

  const poll = POLLS[currentPollIndex];
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  // Load live results from API on mount
  const [liveResults, setLiveResults] = useState<Record<string, Record<string, number>>>({});
  
  useEffect(() => {
    turso.execute('SELECT poll_id, vote_choice as option_id, COUNT(*) as total_votes FROM poll_votes GROUP BY poll_id, vote_choice')
      .then(res => {
        const map: Record<string, Record<string, number>> = {};
        res.rows.forEach(r => {
          const pollId = r.poll_id as string;
          const optionId = r.option_id as string;
          const votes = Number(r.total_votes);
          if (!map[pollId]) map[pollId] = {};
          map[pollId][optionId] = votes;
        });
        setLiveResults(map);
      })
      .catch(() => {}); // Graceful fallback to seed data
  }, []);

  // Helper: Get vote count (live + seed)
  const getVoteCount = (pollId: string, optionId: string, seedVotes: number) => {
    return seedVotes + (liveResults[pollId]?.[optionId] || 0);
  };

  // Auto-rotate every 15 seconds if user hasn't voted on current poll
  useEffect(() => {
    if (hasVoted[poll.id]) return;
    const timer = setInterval(() => {
      setCurrentPollIndex(prev => (prev + 1) % POLLS.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [currentPollIndex, hasVoted, poll.id]);

  // Persist vote to API
  const persistVote = async (pollId: string, optionIds: string[]) => {
    try {
      const sessionId = sessionStorage.getItem('gghp_session') || 
        (() => { const id = 'sess_' + Math.random().toString(36).slice(2); sessionStorage.setItem('gghp_session', id); return id; })();
      const jurisdiction = sessionStorage.getItem('gghp_jurisdiction') || 'Unknown';
      
      const stmts = optionIds.map(opt => ({
        sql: 'INSERT INTO poll_votes (id, poll_id, voter_id, jurisdiction, vote_choice) VALUES (?, ?, ?, ?, ?)',
        args: [`vote_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, pollId, sessionId, jurisdiction, opt]
      }));
      await turso.batch(stmts, 'write');
    } catch (e) {
      console.error('Failed to save vote', e);
    }
  };

  const handleVote = (optionId: string) => {
    if (hasVoted[poll.id]) return;
    const currentSelections = selectedOptions[poll.id] || [];
    if (poll.allowMultiple) {
      if (currentSelections.includes(optionId)) {
        setSelectedOptions({ ...selectedOptions, [poll.id]: currentSelections.filter(id => id !== optionId) });
      } else {
        setSelectedOptions({ ...selectedOptions, [poll.id]: [...currentSelections, optionId] });
      }
    } else {
      setSelectedOptions({ ...selectedOptions, [poll.id]: [optionId] });
      setTimeout(() => {
        setHasVoted({ ...hasVoted, [poll.id]: true });
        persistVote(poll.id, [optionId]);
        setTimeout(() => setCurrentPollIndex(prev => (prev + 1) % POLLS.length), 3000);
      }, 300);
    }
  };

  const submitMultiVote = () => {
    const selections = selectedOptions[poll.id] || [];
    if (selections.length > 0) {
      setHasVoted({ ...hasVoted, [poll.id]: true });
      persistVote(poll.id, selections);
      setTimeout(() => setCurrentPollIndex(prev => (prev + 1) % POLLS.length), 3000);
    }
  };

  const nextPoll = () => setCurrentPollIndex((currentPollIndex + 1) % POLLS.length);
  const prevPoll = () => setCurrentPollIndex((currentPollIndex - 1 + POLLS.length) % POLLS.length);

  // Progress dots
  const dotCount = Math.min(POLLS.length, 10);
  const startDot = Math.max(0, currentPollIndex - Math.floor(dotCount / 2));

  return (
    <div className={`w-full ${compact ? '' : 'max-w-[1000px] mx-auto'}`}>
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-900 rounded-2xl border border-emerald-700/30 overflow-hidden shadow-xl shadow-emerald-900/20 relative">
        {/* Glow effects */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-400 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative z-10 px-6 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${poll.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
              <Vote size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">🗳️ We Want Your Opinion</span>
              </div>
              <p className="text-emerald-400/60 text-[10px] font-bold mt-0.5">
                Poll {currentPollIndex + 1} of {POLLS.length} • {totalVotes.toLocaleString()} votes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={prevPoll} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={nextPoll} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="relative z-10 px-6 pb-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={poll.id + '-q'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-white font-black text-sm leading-snug"
            >
              {poll.question}
            </motion.p>
          </AnimatePresence>
          {poll.subtitle && (
            <p className="text-emerald-300/60 text-[10px] mt-1 leading-relaxed max-w-lg">{poll.subtitle}</p>
          )}
        </div>

        {/* Options */}
        <div className="relative z-10 px-6 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={poll.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {poll.options.map((option) => {
                const percentage = Math.round((option.votes / totalVotes) * 100);
                const isSelected = (selectedOptions[poll.id] || []).includes(option.id);
                const voted = hasVoted[poll.id];

                return (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={voted && !poll.allowMultiple}
                    className={`relative overflow-hidden rounded-xl p-2.5 text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/30 border-2 border-emerald-400 shadow-lg shadow-emerald-500/10'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                    } ${voted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {voted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="absolute inset-y-0 left-0 bg-emerald-500/15 rounded-xl"
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="text-sm">{option.emoji}</span>
                      <span className="text-white text-[11px] font-bold flex-1 leading-tight">{option.label}</span>
                      {voted && <span className="text-emerald-400 text-[11px] font-black">{percentage}%</span>}
                      {isSelected && !voted && <CircleCheck size={13} className="text-emerald-400" />}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {poll.allowMultiple && !hasVoted[poll.id] && (selectedOptions[poll.id] || []).length > 0 && (
              <button
                onClick={submitMultiVote}
                className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black hover:bg-emerald-400 transition-all shadow-lg"
              >
                Submit ({(selectedOptions[poll.id] || []).length} selected)
              </button>
            )}
            {hasVoted[poll.id] && (
              <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <CircleCheck size={12} /> Thank you for voting!
              </span>
            )}
          </div>
          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {Array.from({ length: dotCount }).map((_, i) => {
              const dotIndex = startDot + i;
              if (dotIndex >= POLLS.length) return null;
              return (
                <button
                  key={dotIndex}
                  onClick={() => setCurrentPollIndex(dotIndex)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    dotIndex === currentPollIndex
                      ? 'bg-emerald-400 w-4'
                      : hasVoted[POLLS[dotIndex]?.id] ? 'bg-emerald-600' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep StickyPollWidget for backward compatibility but make it use the new banner
export const StickyPollWidget = () => null; // Deprecated — replaced by RevolvingSurveyBanner

export default FeaturedPoll;
