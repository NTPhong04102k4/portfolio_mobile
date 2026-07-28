import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const labels = [
  'Native Swift',
  'Native Kotlin',
  'React Native',
  'Flutter (GetX)',
  'ForgeRock & Biometric',
  'Goong Maps API',
];

const data = {
  labels,
  datasets: [
    {
      label: 'Core Native & Mobile Stack',
      data: [9, 9, 9, 8.5, 9, 8.5],
      backgroundColor: 'rgba(56, 189, 248, 0.25)',
      borderColor: 'rgba(56, 189, 248, 0.9)',
      borderWidth: 2,
      pointRadius: 3,
    },
    {
      label: 'Enterprise Security & IAM',
      data: [9, 9, 8, 8, 9.5, 8],
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: 'rgba(139, 92, 246, 0.9)',
      borderWidth: 2,
      pointRadius: 3,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#e5e7eb',
        font: { size: 12 },
      },
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 10,
      angleLines: {
        color: 'rgba(148, 163, 184, 0.4)',
      },
      grid: {
        color: 'rgba(31, 41, 55, 0.9)',
      },
      ticks: {
        display: false,
      },
      pointLabels: {
        color: '#e5e7eb',
        font: {
          size: 11,
          weight: 'bold' as const,
        },
      },
    },
  },
};

export function SkillsRadar() {
  return (
    <section className="skills-radar">
      <header className="skills-radar__header">
        <h3>Skills Radar · Native Code & Mobile Stack</h3>
        <p>
          Đánh giá năng lực chuyên môn tập trung vào <strong>Native Swift & Kotlin</strong>,
          hệ thống định danh <strong>ForgeRock IAM</strong>, <strong>Biometric Authentication</strong>, <strong>Flutter GetX</strong> và <strong>Goong Maps API</strong>.
        </p>
      </header>
      <div className="skills-radar__chart" style={{ position: 'relative', height: '320px', width: '100%' }}>
        <Radar data={data} options={options} />
      </div>
    </section>
  );
}
