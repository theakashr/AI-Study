import { useState, useEffect } from 'react';

export function useCooldown(initialCooldown: number = 0) {
  const [cooldown, setCooldown] = useState(initialCooldown);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
  };

  return { cooldown, startCooldown };
}
