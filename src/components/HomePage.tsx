import Icon from "@/components/ui/icon";

interface HomePageProps {
  onStartChat: () => void;
  onOpenMenu: () => void;
}

const FEATURES = [
  {
    icon: "Brain",
    title: "Умные ответы",
    desc: "Кейн анализирует контекст и даёт точные, релевантные ответы на любые вопросы",
    color: "var(--kane-purple)",
  },
  {
    icon: "Mic",
    title: "Голос и тон",
    desc: "Настройте стиль общения: от формального до дружеского, от краткого до детального",
    color: "var(--kane-cyan)",
  },
  {
    icon: "Zap",
    title: "Мгновенный ответ",
    desc: "Никаких задержек. Кейн отвечает в режиме реального времени, слово за словом",
    color: "var(--kane-pink)",
  },
  {
    icon: "History",
    title: "Память диалогов",
    desc: "Все ваши беседы сохраняются. Вернитесь к любому диалогу в любое время",
    color: "var(--kane-green)",
  },
];

const QUICK_PROMPTS = [
  "Помоги написать текст для сайта",
  "Придумай идеи для контента",
  "Объясни сложную тему простыми словами",
  "Составь план проекта",
];

export default function HomePage({ onStartChat, onOpenMenu }: HomePageProps) {
  return (
    <div className="h-full overflow-y-auto">
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 md:hidden">
        <button onClick={onOpenMenu} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground">
          <Icon name="Menu" size={20} />
        </button>
        <div className="font-bold kane-gradient-text text-lg mono">Кейн</div>
        <div className="w-8" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 mono"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "var(--kane-purple)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-kane-purple animate-pulse" />
            Персональный ИИ-ассистент
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight">
            Привет, я{" "}
            <span className="kane-gradient-text">Кейн</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
            Ваш умный ИИ-ассистент, настроенный под вас. Пишу тексты, отвечаю на вопросы, помогаю с задачами.
          </p>

          <button
            onClick={onStartChat}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white kane-gradient-bg transition-all duration-300 hover:opacity-90 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] active:scale-[0.98]"
          >
            <Icon name="MessageCircle" size={20} />
            Начать диалог
            <Icon name="ArrowRight" size={18} />
          </button>
        </div>

        {/* Quick prompts */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs text-muted-foreground text-center mb-4 mono uppercase tracking-widest">Попробуйте спросить</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={onStartChat}
                className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] animate-fade-in"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                animationDelay: `${0.15 + i * 0.07}s`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}30` }}
              >
                <Icon name={feature.icon} size={20} style={{ color: feature.color }} />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
