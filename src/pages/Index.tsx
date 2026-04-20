import { useState } from "react";
import HomePage from "@/components/HomePage";
import ChatPage from "@/components/ChatPage";
import HistoryPage from "@/components/HistoryPage";
import SettingsPage from "@/components/SettingsPage";
import Sidebar from "@/components/Sidebar";

export type Page = "home" | "chat" | "history" | "settings";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  date: string;
  messages: ChatMessage[];
}

const DEMO_SESSIONS: ChatSession[] = [
  {
    id: "1",
    title: "Маркетинговая стратегия",
    preview: "Как построить воронку продаж для SaaS...",
    date: "Сегодня",
    messages: [
      { id: "1", role: "user", text: "Как построить воронку продаж для SaaS-продукта?", time: "14:32" },
      { id: "2", role: "ai", text: "Отличный вопрос! Для SaaS-воронки рекомендую следующую структуру:\n\n**1. Осведомлённость** — контент-маркетинг, SEO, платная реклама\n**2. Интерес** — бесплатные материалы, вебинары, демо\n**3. Рассмотрение** — триал-период, кейсы, сравнение\n**4. Конверсия** — онбординг, поддержка, оффер\n\nКлюч — минимизировать трение на каждом этапе.", time: "14:33" },
    ]
  },
  {
    id: "2",
    title: "Анализ конкурентов",
    preview: "Помоги проанализировать рынок CRM...",
    date: "Вчера",
    messages: [
      { id: "1", role: "user", text: "Помоги проанализировать рынок CRM-систем в России", time: "10:15" },
      { id: "2", role: "ai", text: "Рынок CRM в России активно развивается. Основные игроки: Битрикс24, AmoCRM, МегаПлан. Для анализа рекомендую фреймворк SWOT + анализ по 5 силам Портера.", time: "10:16" },
    ]
  },
  {
    id: "3",
    title: "Текст для лендинга",
    preview: "Нужен продающий текст для сайта...",
    date: "20 апр",
    messages: [
      { id: "1", role: "user", text: "Нужен продающий текст для лендинга фитнес-клуба", time: "18:44" },
      { id: "2", role: "ai", text: "Вот структура продающего лендинга для фитнес-клуба: заголовок с выгодой, социальное доказательство, описание программ, тарифы, призыв к действию.", time: "18:45" },
    ]
  },
];

export default function Index() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [sessions, setSessions] = useState<ChatSession[]>(DEMO_SESSIONS);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Пользователь");

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "Новый диалог",
      preview: "Начните общение с Кейном...",
      date: "Сегодня",
      messages: [],
    };
    setActiveSession(newSession);
    setActivePage("chat");
  };

  const openSession = (session: ChatSession) => {
    setActiveSession(session);
    setActivePage("chat");
  };

  const updateSession = (session: ChatSession) => {
    setActiveSession(session);
    setSessions(prev => {
      const exists = prev.find(s => s.id === session.id);
      if (exists) return prev.map(s => s.id === session.id ? session : s);
      return [session, ...prev];
    });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 orb-float"
          style={{
            background: "radial-gradient(circle, var(--kane-purple) 0%, transparent 70%)",
            top: "-200px",
            right: "-100px",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, var(--kane-cyan) 0%, transparent 70%)",
            bottom: "-150px",
            left: "-100px",
            opacity: 0.07,
            animation: "orb-float 8s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, var(--kane-pink) 0%, transparent 70%)",
            top: "40%",
            left: "40%",
            opacity: 0.05,
            animation: "orb-float 10s ease-in-out infinite 2s",
          }}
        />
      </div>

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onNewChat={startNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
      />

      <main className="flex-1 relative z-10 overflow-hidden">
        {activePage === "home" && (
          <HomePage onStartChat={startNewChat} onOpenMenu={() => setSidebarOpen(true)} />
        )}
        {activePage === "chat" && (
          <ChatPage
            session={activeSession}
            onUpdateSession={updateSession}
            onOpenMenu={() => setSidebarOpen(true)}
          />
        )}
        {activePage === "history" && (
          <HistoryPage
            sessions={sessions}
            onOpenSession={openSession}
            onNewChat={startNewChat}
            onOpenMenu={() => setSidebarOpen(true)}
          />
        )}
        {activePage === "settings" && (
          <SettingsPage
            onOpenMenu={() => setSidebarOpen(true)}
            userName={userName}
            onUserNameChange={setUserName}
          />
        )}
      </main>
    </div>
  );
}