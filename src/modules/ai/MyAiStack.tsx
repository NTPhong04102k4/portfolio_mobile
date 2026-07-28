import { motion } from 'framer-motion';

const tools = [
  {
    id: 'cursor',
    label: 'Cursor IDE',
    role: 'Pair programming, refactor, code review',
    stage: 'Design & Implementation',
  },
  {
    id: 'claude',
    label: 'Claude / GPT',
    role: 'Ý tưởng kiến trúc, viết spec, test case',
    stage: 'Planning & Architecture',
  },
  {
    id: 'github',
    label: 'GitHub + PR',
    role: 'Code review, changelog, release notes',
    stage: 'Collaboration',
  },
  {
    id: 'monitoring',
    label: 'Perf & Monitoring',
    role: 'Phân tích log, performance trace',
    stage: 'Production',
  },
];

const flows = [
  'Ý tưởng & yêu cầu',
  'Thiết kế kiến trúc với AI',
  'Implement + Refactor trong Cursor',
  'Test & tối ưu hiệu năng',
  'Release & quan sát người dùng',
];

export function MyAiStack() {
  return (
    <section className="ai-stack">
      <header className="ai-stack__header">
        <h3>My AI Stack · AI-first workflow</h3>
        <p>
          Mình không chỉ dùng AI để &quot;viết code hộ&quot;, mà thiết kế cả quy trình
          phát triển theo tư duy AI-first: từ thiết kế kiến trúc, viết test cho đến
          phân tích performance.
        </p>
      </header>

      <div className="ai-stack__layout">
        <div className="ai-stack__lane">
          <p className="ai-stack__lane-title">Workflow overview</p>
          <ol className="ai-stack__flow">
            {flows.map((step, index) => (
              <li key={step} className="ai-stack__flow-step">
                <span className="ai-stack__flow-index">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="ai-stack__lane">
          <p className="ai-stack__lane-title">Tools & responsibilities</p>
          <div className="ai-stack__tools">
            {tools.map((tool) => (
              <motion.article
                key={tool.id}
                className="ai-stack__card"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <h4>{tool.label}</h4>
                <p className="ai-stack__card-role">{tool.role}</p>
                <p className="ai-stack__card-stage">{tool.stage}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
