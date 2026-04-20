import Icon from "@/components/ui/icon";
import { Page } from "@/pages/Index";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const NAV_ITEMS = [
  { id: "home" as Page, icon: "Sparkles", label: "Главная" },
  { id: "chat" as Page, icon: "MessageCircle", label: "Диалог" },
  { id: "history" as Page, icon: "Clock", label: "История" },
  { id: "settings" as Page, icon: "Settings2", label: "Настройки" },
];

export default function Sidebar({ activePage, onNavigate, onNewChat, isOpen, onClose, userName }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative z-30 h-full
          w-64 flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          background: "rgba(10, 10, 20, 0.95)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center kane-gradient-bg animate-pulse-glow"
          >
            <span className="text-white font-bold text-lg mono">K</span>
          </div>
          <div>
            <div className="font-bold text-white text-lg tracking-wide">Кейн</div>
            <div className="text-xs text-muted-foreground mono">AI Assistant</div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-4 mb-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 kane-gradient-bg text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Icon name="Plus" size={16} />
            Новый диалог
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose(); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${activePage === item.id
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }
              `}
              style={activePage === item.id ? {
                background: "rgba(139,92,246,0.15)",
                boxShadow: "inset 0 0 0 1px rgba(139,92,246,0.3)",
              } : {}}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${activePage === item.id ? "kane-gradient-bg" : "bg-white/5"}
              `}>
                <Icon
                  name={item.icon}
                  size={16}
                  className={activePage === item.id ? "text-white" : "text-muted-foreground"}
                />
              </div>
              {item.label}
              {activePage === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-kane-purple" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom user section */}
        <div className="p-4">
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: "var(--kane-gradient)" }}
            >
              {userName.trim().charAt(0).toUpperCase() || "П"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{userName || "Пользователь"}</div>
              <div className="text-xs text-muted-foreground">Про-аккаунт</div>
            </div>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          </div>
        </div>
      </aside>
    </>
  );
}