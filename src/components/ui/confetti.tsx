"use client";

import confetti from "canvas-confetti";

export function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 50,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function triggerStreakConfetti(streakCount: number) {
  if (streakCount % 7 === 0) {
    // Weekly milestone
    triggerConfetti();
  } else if (streakCount % 30 === 0) {
    // Monthly milestone - extra celebration
    triggerConfetti();
    setTimeout(() => triggerConfetti(), 300);
  }
}
