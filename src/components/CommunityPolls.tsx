import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Vote,
  ChevronRight,
  ChevronLeft,
  Heart,
  Leaf,
  BarChart3,
  Users,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  MessageCircle,
  TrendingUp,
  Zap,
  Shield,
} from 'lucide-react';

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
];

// ─── Featured Poll (top banner) ───
export const FeaturedPoll = () => {
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const poll = POLLS[currentPollIndex];
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

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
        // Auto-advance 3s after voting
        setTimeout(() => setCurrentPollIndex(prev => (prev + 1) % POLLS.length), 3000);
      }, 300);
    }
  };

  const submitMultiVote = () => {
    if ((selectedOptions[poll.id] || []).length > 0) {
      setHasVoted({ ...hasVoted, [poll.id]: true });
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
              const percentage = Math.round((option.votes / totalVotes) * 100);
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
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    )}
                  </div>

                  {voted && (
                    <p className="text-[10px] text-emerald-500/60 font-bold mt-1 relative z-10 ml-7">
                      {(option.votes + (isSelected ? 1 : 0)).toLocaleString()} votes
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
                <CheckCircle2 size={14} /> Thank you for voting!
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

// ─── Sticky Side Poll Widget ───
export const StickyPollWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [showAfterScroll, setShowAfterScroll] = useState(false);

  // Show after scrolling past the hero
  useEffect(() => {
    const handleScroll = () => {
      setShowAfterScroll(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const poll = POLLS[currentPollIndex];
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = (optionId: string) => {
    if (hasVoted[poll.id]) return;
    setSelectedOptions({ ...selectedOptions, [poll.id]: [optionId] });
    setTimeout(() => setHasVoted({ ...hasVoted, [poll.id]: true }), 300);
  };

  const nextPoll = () => setCurrentPollIndex((currentPollIndex + 1) % POLLS.length);

  if (!showAfterScroll) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-emerald-500 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform group relative"
          >
            <Vote size={22} />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-black text-white animate-pulse">
              {POLLS.length}
            </div>
            <div className="absolute left-full ml-3 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none">
              🗳️ Vote Now!
            </div>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[70vh]"
          >
            {/* Widget Header */}
            <div className={`bg-gradient-to-r ${poll.bgGradient} p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Vote size={16} className="text-white" />
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Community Voice</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <p className="text-white font-bold text-sm leading-snug">{poll.question}</p>
              <p className="text-white/60 text-[10px] mt-1">Poll {currentPollIndex + 1} of {POLLS.length}</p>
            </div>

            {/* Options */}
            <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
              {poll.options.map((option) => {
                const percentage = Math.round((option.votes / totalVotes) * 100);
                const isSelected = (selectedOptions[poll.id] || []).includes(option.id);
                const voted = hasVoted[poll.id];

                return (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={voted}
                    className={`relative w-full overflow-hidden rounded-xl p-3 text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-2 border-emerald-400'
                        : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {voted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-y-0 left-0 bg-emerald-100 rounded-xl"
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="text-base">{option.emoji}</span>
                      <span className="text-slate-800 text-xs font-bold flex-1">{option.label}</span>
                      {voted && <span className="text-emerald-600 text-xs font-black">{percentage}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-between">
              {hasVoted[poll.id] ? (
                <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Thanks!
                </span>
              ) : (
                <span className="text-slate-400 text-[10px] font-bold">{totalVotes.toLocaleString()} votes</span>
              )}
              <button onClick={nextPoll} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Next Poll <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturedPoll;

