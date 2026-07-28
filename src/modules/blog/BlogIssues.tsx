import { useState } from 'react';

type IssueStatus = 'open' | 'closed';

type Issue = {
  id: string;
  title: string;
  status: IssueStatus;
  tags: string[];
  body: string[];
};

const issues: Issue[] = [
  {
    id: 'adv-js-concepts',
    title: '5 advanced JavaScript concept hay gặp khi debug',
    status: 'open',
    tags: ['JavaScript', 'Concepts', 'Debug'],
    body: [
      '1. Closure và việc “giữ” state sau khi function đã return.',
      '2. Hoisting của var / function declaration và sự khác biệt với let / const.',
      '3. Optional chaining / nullish coalescing khi làm việc với dữ liệu từ API.',
      '4. Event loop & microtasks (Promise.then) khiến log chạy không theo thứ tự mình nghĩ.',
      '5. this binding trong callback và khi dùng class method / arrow function.',
    ],
  },
  {
    id: 'flatlist-optimization',
    title: 'Tối ưu FlatList với useCallback, useMemo, React.memo',
    status: 'open',
    tags: ['React Native', 'FlatList', 'Performance'],
    body: [
      'Sử dụng React.memo cho ItemComponent để tránh re-render toàn bộ list.',
      'Bọc renderItem bằng useCallback và truyền keyExtractor ổn định.',
      'Cấu hình getItemLayout, initialNumToRender, windowSize cho danh sách lớn.',
      'Tránh inline function trong JSX và tránh tạo object/style mới mỗi render.',
    ],
  },
  {
    id: 'textinput-validation',
    title: 'Các case validate trên TextInput (email, số, trimming, debounce)',
    status: 'open',
    tags: ['Validation', 'UX', 'Forms'],
    body: [
      'Trim khoảng trắng đầu/cuối trước khi validate và gửi request.',
      'Debounce onChangeText khi validate realtime để tránh lag UI.',
      'Tách rõ error message theo field (email, password, confirmPassword...).',
      'Xử lý keyboardType, autoCapitalize, autoCorrect đúng loại input.',
    ],
  },
  {
    id: 'ts-special-cases',
    title: 'Những case “khó chịu” với TypeScript & JS',
    status: 'open',
    tags: ['TypeScript', 'Typing'],
    body: [
      'Undefined vs null khi mapping dữ liệu từ API backend không đồng nhất.',
      'Sử dụng type guard để phân biệt union type thay vì ép any.',
      'Tách riêng type DTO (dữ liệu từ API) và type UI (dùng trong component).',
      'Khi dùng generic / utility types (Partial, Pick, Omit) cần đặt tên type rõ ràng.',
    ],
  },
  {
    id: 'platform-permissions',
    title: 'Các câu hỏi sâu về quyền Android / iOS (Notification, Camera...)',
    status: 'open',
    tags: ['Android', 'iOS', 'Permissions'],
    body: [
      'Khác biệt giữa runtime permission Android và iOS (push notification, camera, location).',
      'Handle case user từ chối permission nhiều lần và mở Settings thủ công.',
      'Mapping quyền Native (Info.plist, AndroidManifest) với logic trong React Native.',
      'Test permission trên thiết bị thật vs simulator/emulator và các edge-case.',
    ],
  },
];

export function BlogIssues() {
  const [openIds, setOpenIds] = useState<string[]>([issues[0]?.id ?? '']);

  const toggleIssue = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="blog-issues">
      {issues.map((issue) => {
        const isOpen = openIds.includes(issue.id);

        return (
          <article
            key={issue.id}
            className={`blog-issue blog-issue--${issue.status}${
              isOpen ? ' blog-issue--expanded' : ''
            }`}
          >
            <button
              type="button"
              className="blog-issue__header"
              onClick={() => toggleIssue(issue.id)}
            >
              <span className={`blog-issue__status blog-issue__status--${issue.status}`}>
                {issue.status === 'open' ? 'OPEN' : 'CLOSED'}
              </span>
              <span className="blog-issue__title">{issue.title}</span>
              <span className="blog-issue__caret">{isOpen ? '▾' : '▸'}</span>
            </button>
            <div className="blog-issue__meta">
              {issue.tags.map((tag) => (
                <span key={tag} className="blog-issue__tag">
                  {tag}
                </span>
              ))}
            </div>
            {isOpen && (
              <div className="blog-issue__body">
                {issue.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
