import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ChatSession, ChatMessage } from "@/pages/Index";

const CHAT_URL = "https://functions.poehali.dev/57571387-9128-46c1-8c9f-fbaef0ba4338";

interface ChatPageProps {
  session: ChatSession | null;
  onUpdateSession: (session: ChatSession) => void;
  onOpenMenu: () => void;
}

function formatText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatPage({ session, onUpdateSession, onOpenMenu }: ChatPageProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = session?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: userMsg,
      time,
    };

    const updatedMessages = [...messages, newMsg];
    const updatedSession: ChatSession = {
      ...(session || { id: Date.now().toString(), date: "Сегодня" }),
      title: session?.title === "Новый диалог" || !session?.title
        ? userMsg.slice(0, 40)
        : session.title,
      preview: userMsg.slice(0, 60) + (userMsg.length > 60 ? "..." : ""),
      messages: updatedMessages,
    };
    onUpdateSession(updatedSession);
    setIsTyping(true);

    try {
      const assistantName = (() => {
        try { return JSON.parse(localStorage.getItem("kane_assistantName") || '"Кейн"'); } catch { return "Кейн"; }
      })();

      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, assistantName }),
      });

      const data = await res.json();
      const aiText = data.reply || "Извините, не удалось получить ответ. Попробуйте ещё раз.";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: aiText,
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
      };
      onUpdateSession({ ...updatedSession, messages: [...updatedMessages, aiMsg] });
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Ошибка соединения. Проверьте интернет и попробуйте снова.",
        time,
      };
      onUpdateSession({ ...updatedSession, messages: [...updatedMessages, errMsg] });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button onClick={onOpenMenu} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground md:hidden">
          <Icon name="Menu" size={20} />
        </button>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center kane-gradient-bg"
        >
          <span className="text-white font-bold text-sm mono">K</span>
        </div>
        <div>
          <div className="font-semibold text-sm text-foreground">
            {session?.title || "Кейн"}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-kane-green animate-pulse" />
            В сети
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
            <Icon name="MoreHorizontal" size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-fade-in">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 kane-gradient-bg animate-pulse-glow"
            >
              <span className="text-white font-black text-2xl mono">K</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Начните диалог</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Напишите любой вопрос или задачу — Кейн готов помочь
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex gap-3 message-enter ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 kane-gradient-bg">
                <span className="text-white font-bold text-xs mono">K</span>
              </div>
            )}
            <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-tr-md text-white"
                    : "rounded-tl-md text-foreground"
                }`}
                style={msg.role === "user"
                  ? { background: "var(--kane-gradient)" }
                  : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {formatText(msg.text)}
              </div>
              <span className="text-xs text-muted-foreground px-1 mono">{msg.time}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 message-enter">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 kane-gradient-bg">
              <span className="text-white font-bold text-xs mono">K</span>
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-md"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map(j => (
                  <div
                    key={j}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "var(--kane-purple)",
                      animation: `bounce 1s ease-in-out infinite`,
                      animationDelay: `${j * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 md:px-8 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="flex items-end gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${input ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`,
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Напишите сообщение..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed"
            style={{ maxHeight: "140px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 kane-gradient-bg hover:opacity-90 hover:scale-105 disabled:opacity-30 disabled:scale-100 text-white"
          >
            <Icon name="ArrowUp" size={16} />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2 mono">
          Enter — отправить · Shift+Enter — новая строка
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}