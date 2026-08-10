interface ServerRequest {
  method?: string;
  body?: {
    cvIntro?: string;
    messages?: ChatMessage[];
  };
}

interface ServerResponse {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ServerResponse;
  json: (data: Record<string, unknown>) => void;
}

interface ChatMessage {
  role?: string;
  content?: string;
}

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: ServerRequest, res: ServerResponse): Promise<void> {
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.status(200).json({});
    return;
  }

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' });
    return;
  }

  try {
    const { cvIntro, messages } = req.body ?? {};

    const systemPrompt =
      'Bạn là trợ lý ảo của Nguyễn Thế Phong - một Middle Mobile Developer sinh năm 2004. ' +
      'Bạn chỉ trả lời dựa trên thông tin CV, dự án CredHR (Quản lý nhân sự tích hợp ForgeRock IAM, Biometric, Goong Maps) và Eatsy (800k+ lượt tải), 3 năm kinh nghiệm thực tế với React Native/Flutter/Native (Swift/Kotlin). ' +
      'Phong cách trả lời: chuyên nghiệp, khiêm tốn và am hiểu công nghệ.\n\n';

    const conversationText = Array.isArray(messages)
      ? messages
          .map((m: ChatMessage) =>
            m && typeof m.content === 'string'
              ? `${m.role === 'user' ? 'Người tuyển dụng' : 'Assistant'}: ${m.content}`
              : '',
          )
          .join('\n')
      : '';

    const fullPrompt = `${systemPrompt}TÓM TẮT CV:\n${cvIntro ?? ''}\n\nDưới đây là đoạn hội thoại, hãy trả lời câu hỏi cuối cùng một cách ngắn gọn, tập trung vào kết quả, công nghệ và vai trò của Phong:\n${conversationText}`;

    const url = `${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: fullPrompt }],
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errorBody = await geminiRes.text();
      console.error('Gemini error', geminiRes.status, errorBody);

      if (geminiRes.status === 429) {
        res.status(429).json({
          answer:
            'Gemini đang giới hạn tần suất (429). Bạn có thể thử lại sau vài giây, hoặc xem nhanh thông tin ở tab Projects/Experience.',
        });
        return;
      }

      res.status(500).json({ error: 'Gemini API error' });
      return;
    }

    const data = (await geminiRes.json()) as GeminiResponse;
    const candidates = data.candidates ?? [];
    const parts = candidates[0]?.content?.parts ?? [];
    const text = parts
      .map((p: GeminiPart) => (typeof p.text === 'string' ? p.text : ''))
      .join(' ')
      .trim();

    if (!text) {
      res.status(200).json({
        answer:
          'Hiện tại mình chưa nhận được nội dung rõ ràng từ Gemini, nhưng bạn có thể xem nhanh tab Projects/Experience để hiểu thêm về profile của Phong.',
      });
      return;
    }

    res.status(200).json({ answer: text });
  } catch (error) {
    console.error('ai-assistant error', error);
    res.status(500).json({
      error: 'Unexpected server error',
    });
  }
}
