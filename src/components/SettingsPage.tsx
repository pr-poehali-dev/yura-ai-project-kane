import { useState } from "react";
import Icon from "@/components/ui/icon";

interface SettingsPageProps {
  onOpenMenu: () => void;
  userName: string;
  onUserNameChange: (name: string) => void;
}

const VOICES = [
  { id: "neutral", label: "Нейтральный", desc: "Сбалансированный тон без выраженного характера", icon: "CircleDot" },
  { id: "friendly", label: "Дружелюбный", desc: "Тёплое и неформальное общение", icon: "Smile" },
  { id: "professional", label: "Профессиональный", desc: "Деловой стиль для рабочих задач", icon: "Briefcase" },
  { id: "creative", label: "Творческий", desc: "Яркий и нестандартный стиль ответов", icon: "Sparkles" },
];

const RESPONSE_STYLES = [
  { id: "brief", label: "Кратко", desc: "Только суть" },
  { id: "balanced", label: "Сбалансировано", desc: "Ответ + пояснение" },
  { id: "detailed", label: "Подробно", desc: "Развёрнутые ответы" },
];

const LANGUAGES = [
  { id: "ru", label: "Русский", flag: "🇷🇺" },
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "mixed", label: "Смешанный", flag: "🌐" },
];

export default function SettingsPage({ onOpenMenu, userName, onUserNameChange }: SettingsPageProps) {
  const [selectedVoice, setSelectedVoice] = useState("friendly");
  const [responseStyle, setResponseStyle] = useState("balanced");
  const [language, setLanguage] = useState("ru");
  const [customName, setCustomName] = useState("Кейн");
  const [notifications, setNotifications] = useState(true);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
        <h1 className="font-bold text-lg text-foreground">Настройки</h1>
        <button
          onClick={handleSave}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            saved ? "text-kane-green" : "text-white kane-gradient-bg hover:opacity-90"
          }`}
          style={saved ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" } : {}}
        >
          <Icon name={saved ? "Check" : "Save"} size={16} />
          {saved ? "Сохранено!" : "Сохранить"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-8">

        {/* Profile */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.15)" }}
            >
              <Icon name="User" size={14} style={{ color: "var(--kane-purple)" }} />
            </div>
            <h2 className="font-semibold text-foreground">Профиль</h2>
          </div>
          <div
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
              style={{ background: "var(--kane-gradient)" }}
            >
              {userName.trim().charAt(0).toUpperCase() || "П"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1.5 mono">Ваше имя</div>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <input
                  type="text"
                  value={userName}
                  onChange={e => onUserNameChange(e.target.value.slice(0, 30))}
                  className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none min-w-0"
                  placeholder="Введите ваше имя..."
                  onFocus={e => {
                    (e.currentTarget.parentElement as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)";
                    (e.currentTarget.parentElement as HTMLElement).style.boxShadow = "0 0 0 1px rgba(139,92,246,0.2)";
                  }}
                  onBlur={e => {
                    (e.currentTarget.parentElement as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget.parentElement as HTMLElement).style.boxShadow = "none";
                  }}
                />
                <span className="text-xs text-muted-foreground mono flex-shrink-0">{userName.length}/30</span>
              </div>
            </div>
          </div>
        </section>

        {/* Voice & Tone */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.15)" }}
            >
              <Icon name="Mic" size={14} style={{ color: "var(--kane-purple)" }} />
            </div>
            <h2 className="font-semibold text-foreground">Голос и тон</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VOICES.map(voice => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className="p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: selectedVoice === voice.id ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedVoice === voice.id ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    name={voice.icon}
                    size={16}
                    style={{ color: selectedVoice === voice.id ? "var(--kane-purple)" : "var(--muted-foreground)" }}
                  />
                  <span className={`font-medium text-sm ${selectedVoice === voice.id ? "text-foreground" : "text-muted-foreground"}`}>
                    {voice.label}
                  </span>
                  {selectedVoice === voice.id && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-kane-purple" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{voice.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Response style */}
        <section className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(6,182,212,0.15)" }}
            >
              <Icon name="AlignLeft" size={14} style={{ color: "var(--kane-cyan)" }} />
            </div>
            <h2 className="font-semibold text-foreground">Стиль ответов</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {RESPONSE_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setResponseStyle(style.id)}
                className="p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: responseStyle === style.id ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${responseStyle === style.id ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <div className={`font-medium text-sm mb-1 ${responseStyle === style.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {style.label}
                </div>
                <div className="text-xs text-muted-foreground">{style.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Language */}
        <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(236,72,153,0.15)" }}
            >
              <Icon name="Globe" size={14} style={{ color: "var(--kane-pink)" }} />
            </div>
            <h2 className="font-semibold text-foreground">Язык общения</h2>
          </div>
          <div className="flex gap-3">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: language === lang.id ? "rgba(236,72,153,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${language === lang.id ? "rgba(236,72,153,0.4)" : "rgba(255,255,255,0.07)"}`,
                  color: language === lang.id ? "var(--foreground)" : "var(--muted-foreground)",
                }}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Name */}
        <section className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.15)" }}
            >
              <Icon name="Tag" size={14} style={{ color: "var(--kane-orange)" }} />
            </div>
            <h2 className="font-semibold text-foreground">Имя ассистента</h2>
          </div>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
              placeholder="Введите имя ассистента..."
            />
            <span className="text-xs text-muted-foreground mono">{customName.length}/20</span>
          </div>
        </section>

        {/* Toggles */}
        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.15)" }}
            >
              <Icon name="Sliders" size={14} style={{ color: "var(--kane-green)" }} />
            </div>
            <h2 className="font-semibold text-foreground">Дополнительно</h2>
          </div>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {[
              { label: "Память диалогов", desc: "Кейн помнит контекст предыдущих бесед", value: memoryEnabled, onChange: setMemoryEnabled },
              { label: "Уведомления", desc: "Получать уведомления об ответах", value: notifications, onChange: setNotifications },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-4 py-4 ${i > 0 ? "border-t" : ""}`}
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
                <button
                  onClick={() => item.onChange(!item.value)}
                  className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                  style={{
                    background: item.value
                      ? "var(--kane-gradient)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
                    style={{ left: item.value ? "calc(100% - 22px)" : "2px" }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}