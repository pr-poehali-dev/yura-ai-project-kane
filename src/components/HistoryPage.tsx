import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ChatSession } from "@/pages/Index";

interface HistoryPageProps {
  sessions: ChatSession[];
  onOpenSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onOpenMenu: () => void;
}

export default function HistoryPage({ sessions, onOpenSession, onNewChat, onOpenMenu }: HistoryPageProps) {
  const [search, setSearch] = useState("");

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.preview.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, ChatSession[]>>((acc, s) => {
    const key = s.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 sticky top-0 z-10"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,20,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button onClick={onOpenMenu} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground md:hidden">
          <Icon name="Menu" size={20} />
        </button>
        <h1 className="font-bold text-lg text-foreground">История диалогов</h1>
        <button
          onClick={onNewChat}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white kane-gradient-bg hover:opacity-90 transition-all"
        >
          <Icon name="Plus" size={16} />
          Новый
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6">
        {/* Search */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Icon name="Search" size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по диалогам..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={14} />
            </button>
          )}
        </div>

        {/* Sessions grouped */}
        {Object.entries(grouped).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground animate-fade-in">
            <Icon name="MessageCircle" size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Диалогов не найдено</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-muted-foreground mono uppercase tracking-wider">{date}</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
              <div className="space-y-2">
                {items.map(session => (
                  <button
                    key={session.id}
                    onClick={() => onOpenSession(session)}
                    className="w-full text-left p-4 rounded-xl transition-all duration-200 hover:scale-[1.01] group"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.3)";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.06)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}
                      >
                        <Icon name="MessageCircle" size={16} style={{ color: "var(--kane-purple)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground truncate">{session.title}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0 mono">
                            {session.messages.length} сообщ.
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{session.preview}</p>
                      </div>
                      <Icon name="ChevronRight" size={14} className="text-muted-foreground flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
