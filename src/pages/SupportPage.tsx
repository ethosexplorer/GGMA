import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Phone, Mail, MessageSquare, HelpCircle, Send, ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
export const SupportPage = ({ onNavigate }: { onNavigate: (view: 'landing') => void }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [expandedFaqCard, setExpandedFaqCard] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([{
    role: 'bot',
    text: 'Hi there! I am the GGMA Support Assistant. How can I help you regarding cannabis regulations or app support?'
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{title: string, snippet: string, pageid: number}[]>([]);
  const [viewedArticle, setViewedArticle] = useState<{title: string, content: string} | null>(null);

  const faqs = [
    { q: "How do I check my application status?", a: 'You can view your real-time application status by navigating to the "Applications" tab in your portal dashboard. Status updates are polled directly from the state database.' },
    { q: "Is my health and personal information secure?", a: 'Yes, we use end-to-end encryption and comply with all regulatory standards to ensure your data is secure.' },
    { q: "How do I verify a patient's digital card?", a: 'Use the QR code scanner in the mobile app, or enter the card number in the verification portal.' },
    { q: "What formats are allowed for document uploads?", a: 'We accept PDF, JPG, and PNG formats. File size must not exceed 10MB.' },
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setViewedArticle(null);
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Cannabis+${encodeURIComponent(searchQuery)}&utf8=&format=json&origin=*`);
      const data = await res.json();
      setSearchResults(data.query?.search || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewArticle = async (pageid: number, title: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageid}&format=json&origin=*`);
      const data = await res.json();
      const page = data.query.pages[pageid];
      setViewedArticle({ title: page.title, content: page.extract });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearArticleView = () => setViewedArticle(null);
