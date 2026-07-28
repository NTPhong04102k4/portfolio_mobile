import { AnimatePresence,motion } from "framer-motion";
import { type FormEvent,useCallback, useMemo, useState } from "react";

import { cvV1Data } from '@/content/cv_v1.parsed';

type Message = {
  id: number;
  from: "user" | "assistant";
  text: string;
};

const introSummary = `${"Nguyễn Thế Phong"} — ${cvV1Data.profile.title}. ${cvV1Data.intro}`;

async function callAiBackend(messages: Message[]): Promise<string> {
  const buildLocalFallback = () => {
    const last = messages[messages.length - 1]?.text.toLowerCase() ?? "";
    if (last.includes("user") || last.includes("users")) {
      return "Dự án Eatsy đang phục vụ hơn 100.000+ người dùng trên iOS và Android.";
    }
    if (
      last.includes("native") ||
      last.includes("swift") ||
      last.includes("kotlin")
    ) {
      return "Phong có kinh nghiệm viết Native Module bằng Swift/Kotlin, bridge sang React Native để tối ưu hiệu năng các phần như notification, widget và tích hợp SDK.";
    }
    if (
      last.includes("ai") ||
      last.includes("cursor") ||
      last.includes("claude") ||
      last.includes("gemini")
    ) {
      return "Phong áp dụng tư duy AI-first: sử dụng Cursor + Gemini/Claude để thiết kế kiến trúc, viết test, refactor và tối ưu performance trước khi code.";
    }
    return "Hiện tại AI backend tạm thời không phản hồi. Bạn có thể xem nhanh tab Projects/Experience để nắm rõ hơn về profile của Phong.";
  };

  try {
    const res = await fetch("/api/ai-assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cvIntro: introSummary,
        messages: messages.map((m) => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text,
        })),
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return "AI backend đang quá tải (429). Có thể bạn đã gửi quá nhiều câu hỏi trong thời gian ngắn. Hãy đợi một chút rồi thử lại nhé.";
      }

      return buildLocalFallback();
    }

    const data = (await res.json()) as { answer?: string };
    if (data.answer && data.answer.trim().length > 0) {
      return data.answer;
    }

    return buildLocalFallback();
  } catch (error) {
    console.error(error);
    return buildLocalFallback();
  }
}

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "assistant",
      text: "Xin chào 👋 Mình là AI Assistant được huấn luyện từ CV của Phong. Bạn muốn hỏi gì về kinh nghiệm React Native, Native Module hay dự án Eatsy?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isLoading) return;

      const nextUser: Message = {
        id: Date.now(),
        from: "user",
        text: trimmed,
      };
      const nextMessages = [...messages, nextUser];
      setMessages(nextMessages);
      setInput("");
      setIsLoading(true);

      try {
        const answer = await callAiBackend(nextMessages);
        const nextAssistant: Message = {
          id: Date.now() + 1,
          from: "assistant",
          text: answer,
        };
        setMessages((prev) => [...prev, nextAssistant]);
      } catch (error) {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            from: "assistant",
            text: "Có lỗi khi gọi AI. Bạn có thể thử lại sau hoặc xem nhanh ở tab Projects/Experience.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages],
  );

  const shortHint = useMemo(
    () =>
      "Gợi ý: Hỏi về Eatsy, Native Module, tối ưu FlatList hoặc cách mình dùng AI trong workflow.",
    [],
  );

  return (
    <div className="ai-assistant">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-assistant__panel"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <header className="ai-assistant__header">
              <div>
                <p className="ai-assistant__title">
                  AI-first Portfolio Assistant
                </p>
                <p className="ai-assistant__subtitle">
                  Powered by Cursor + Gemini/Claude • Context: CV Eatsy, Native
                  Module, AI workflow
                </p>
              </div>
              <button
                type="button"
                className="ai-assistant__close"
                onClick={handleToggle}
                aria-label="Đóng AI assistant"
              >
                ×
              </button>
            </header>

            <div className="ai-assistant__body">
              <p className="ai-assistant__hint">{shortHint}</p>
              <div className="ai-assistant__messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`ai-assistant__message ai-assistant__message--${msg.from}`}
                  >
                    <p>{msg.text}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="ai-assistant__message ai-assistant__message--assistant">
                    <p>Đang suy nghĩ cùng Cursor & GPT...</p>
                  </div>
                )}
              </div>
            </div>

            <form className="ai-assistant__form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ví dụ: Tell me about Eatsy and 100K+ users..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={!input.trim() || isLoading}>
                Gửi
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="ai-assistant__fab"
        onClick={handleToggle}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="ai-assistant__fab-icon">⚡</span>
        <span className="ai-assistant__fab-label">Ask my AI CV</span>
      </motion.button>
    </div>
  );
}