type ChipGroupProps = {
  label: string;
  items: string[];
};

function ChipGroup({ label, items }: ChipGroupProps) {
  return (
    <section className="tech-group">
      <h3>{label}</h3>
      <ul className="tech-group__chips">
        {items.map((item) => (
          <li key={item} className="tech-chip" data-skill={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TechStack() {
  return (
    <div className="cv-section cv-section--tech">
      <ChipGroup
        label="Mobile & Native"
        items={['React Native', 'React', 'TypeScript', 'Swift', 'Kotlin']}
      />
      <ChipGroup
        label="State & Data"
        items={['Zustand', 'Redux', 'Redux Saga', 'React Query', 'Context API']}
      />
      <ChipGroup
        label="Auth & API"
        items={['OAuth 2.0', 'Facebook SDK', 'Google Sign-In', 'Axios', 'REST']}
      />
      <ChipGroup
        label="Backend & DevOps"
        items={['.NET', 'Node.js / NestJS', 'PostgreSQL', 'Docker']}
      />
      <ChipGroup
        label="Performance & Tools"
        items={[
          'FlatList Optimization',
          'React.memo / useCallback',
          'Flipper',
          'Chrome DevTools',
          'Xcode',
          'Android Studio',
          'Git / GitHub',
        ]}
      />
      <p className="tech-note">
        Chi tiết từng mảng kỹ năng nằm ở tab <strong>Kỹ năng</strong>.
      </p>
    </div>
  );
}