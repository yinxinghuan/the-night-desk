import { useEffect, useState } from 'react';

export function usePreloadedAssets(urls: string[]) {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(urls.length === 0);

  useEffect(() => {
    let cancelled = false;
    setLoaded(0);
    setReady(urls.length === 0);

    if (urls.length === 0) return () => { cancelled = true; };

    let completed = 0;
    const settle = () => {
      completed += 1;
      if (cancelled) return;
      setLoaded(completed);
      if (completed === urls.length) setReady(true);
    };

    urls.forEach((url) => {
      const image = new Image();
      image.onload = () => {
        if (typeof image.decode === 'function') {
          image.decode().catch(() => undefined).finally(settle);
        } else {
          settle();
        }
      };
      image.onerror = settle;
      image.src = url;
    });

    return () => { cancelled = true; };
  }, [urls]);

  return {
    ready,
    progress: urls.length === 0 ? 100 : Math.round((loaded / urls.length) * 100),
  };
}
