"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Scene = {
  id: number;
  label: string;
  headline: string;
  visualCue: string;
  audioCue?: string;
  duration: number;
};

const scenes: Scene[] = [
  {
    id: 0,
    label: "المشهد ١",
    headline: "كلنا نضيع أحيانًا…",
    visualCue: "خلفية داكنة ينبض فيها الضوء بخفة، يرمز للحيرة والبحث.",
    audioCue: "نبضة هادئة + موسيقى ملهمة خفيفة",
    duration: 2
  },
  {
    id: 1,
    label: "المشهد ٢",
    headline: "لكن دائمًا هناك بوصلة تعيدنا للطريق الصحيح.",
    visualCue: "شخص يقف أمام طريق متشعب وسط ضباب خفيف، بريق أمل يلوح.",
    duration: 2
  },
  {
    id: 2,
    label: "المشهد ٣",
    headline: "بوصلة الحياة…",
    visualCue: "خيوط ضوء تتجمع لتشكّل بوصلة متوهجة في المنتصف.",
    audioCue: "ارتفاع بسيط في الموسيقى",
    duration: 3
  },
  {
    id: 3,
    label: "المشهد ٤",
    headline: "7 خطوات تعيد توازنك وتفتح لك باب الازدهار.",
    visualCue: "غلاف الكتاب يظهر بأناقة مع خطوط ضوء تبرز العنوان.",
    duration: 3
  },
  {
    id: 4,
    label: "المشهد ٥",
    headline: "رحلة تغيير حقيقية… تبدأ الآن.",
    visualCue: "شخص يكتب ويتأمل بثقة أمام ضوء الصباح.",
    duration: 3
  }
];

const particlePositions = [
  { left: "8%", top: "78%", size: 14, delay: "0s" },
  { left: "22%", top: "24%", size: 10, delay: "1.8s" },
  { left: "34%", top: "68%", size: 18, delay: "3.2s" },
  { left: "46%", top: "12%", size: 12, delay: "2.5s" },
  { left: "58%", top: "84%", size: 16, delay: "4.1s" },
  { left: "72%", top: "32%", size: 9, delay: "1.1s" },
  { left: "82%", top: "74%", size: 13, delay: "0.7s" },
  { left: "88%", top: "18%", size: 11, delay: "3.8s" },
  { left: "14%", top: "42%", size: 9, delay: "5.5s" },
  { left: "64%", top: "54%", size: 15, delay: "2.2s" }
];

export default function Page() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);

  const totalDuration = useMemo(
    () => scenes.reduce((acc, scene) => acc + scene.duration, 0),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % scenes.length);
    }, scenes[activeIndex].duration * 1000);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  useEffect(() => {
    setSceneProgress(0);

    if (typeof window === "undefined") {
      return;
    }

    let raf = 0;
    const start = performance.now();
    const durationMs = scenes[activeIndex].duration * 1000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const nextProgress = Math.min(elapsed / durationMs, 1);
      setSceneProgress(nextProgress);
      if (elapsed < durationMs) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [activeIndex]);

  const formatTime = (value: number) => `${value.toFixed(0)}s`;

  const elapsed = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < activeIndex; i += 1) {
      sum += scenes[i].duration;
    }
    return sum + sceneProgress * scenes[activeIndex].duration;
  }, [activeIndex, sceneProgress]);

  const activeScene = scenes[activeIndex];
  const backgroundClass = `${styles.background} ${
    styles[`scene${activeScene.id}` as keyof typeof styles] ?? ""
  }`;

  return (
    <main className={styles.main}>
      <div className={backgroundClass} aria-hidden />
      <div className={styles.particleLayer} aria-hidden>
        {particlePositions.map((particle, index) => (
          <span
            key={`${particle.left}-${particle.top}-${index}`}
            className={styles.particle}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay
            }}
          />
        ))}
      </div>

      <section className={styles.content}>
        <span className={styles.label}>{activeScene.label}</span>
        <h1 className={styles.headline}>{activeScene.headline}</h1>
        <p className={styles.visualCue}>{activeScene.visualCue}</p>
        {activeScene.audioCue ? (
          <div className={styles.miniMeta}>
            <span>الصوت:</span>
            <span>{activeScene.audioCue}</span>
          </div>
        ) : null}

        <div className={styles.timeline}>
          <div className={styles.bars}>
            {scenes.map((scene, index) => {
              const fill =
                index < activeIndex
                  ? 1
                  : index > activeIndex
                  ? 0
                  : sceneProgress;
              return (
                <span key={scene.id} className={styles.bar}>
                  <span
                    className={styles.barFill}
                    style={{ transform: `scaleX(${fill})` }}
                  />
                </span>
              );
            })}
          </div>
          <span>
            {formatTime(elapsed)} / {formatTime(totalDuration)}
          </span>
        </div>

        <div className={styles.ctaRow}>
          <p className={styles.tagline}>&quot;بوصلة الحياة&quot; — دليل بصري وصوتي لرحلة تمتد 13 ثانية.</p>
          <button className={styles.ctaButton} type="button">
            تحميل الكتاب الآن
          </button>
        </div>

        <div className={styles.sceneMeta}>
          <span>المدة: {activeScene.duration} ثانية</span>
          <span>الإيقاع: ملهم • تصاعدي</span>
        </div>
      </section>
    </main>
  );
}
