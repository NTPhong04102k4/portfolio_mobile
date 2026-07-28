import { motion } from 'framer-motion';

export function MobileShowcase() {
  return (
    <section className="mobile-showcase">
      <header className="mobile-showcase__header">
        <h3>Eatsy — Health &amp; Nutrition App</h3>
        <p>
          Một vài mockup mô phỏng giao diện di động (iOS/Android) cho các màn hình quan trọng: Onboarding,
          Nhật ký ăn uống và Home Screen Widget.
        </p>
      </header>

      <div className="mobile-showcase__devices">
        <motion.div
          className="mobile-showcase__device mobile-showcase__device--ios"
          whileHover={{ y: -6, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="mobile-showcase__frame">
            <div className="mobile-showcase__screen mobile-showcase__screen--onboarding">
              <p className="mobile-showcase__label">Onboarding</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mobile-showcase__device mobile-showcase__device--android"
          whileHover={{ y: -6, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="mobile-showcase__frame">
            <div className="mobile-showcase__screen mobile-showcase__screen--journal">
              <p className="mobile-showcase__label">Nhật ký ăn uống</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mobile-showcase__device mobile-showcase__device--widget"
          whileHover={{ y: -8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="mobile-showcase__frame mobile-showcase__frame--widget">
            <div className="mobile-showcase__screen mobile-showcase__screen--widget">
              <p className="mobile-showcase__label">Home Screen Widget</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mobile-showcase__bottomsheet">
        <motion.div
          className="mobile-showcase__sheet"
          drag="y"
          dragConstraints={{ top: -40, bottom: 40 }}
          dragElastic={0.2}
        >
          <div className="mobile-showcase__sheet-handle" />
          <p className="mobile-showcase__sheet-title">Gesture-based bottom sheet (web demo)</p>
          <p className="mobile-showcase__sheet-text">
            Mô phỏng trải nghiệm kéo thả bottom sheet trên mobile, sử dụng framer-motion để tạo cảm giác
            native-like ngay trên web.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
