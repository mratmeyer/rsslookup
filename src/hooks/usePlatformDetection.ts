import { useEffect, useState } from "react";

interface UsePlatformDetectionResult {
  isMac: boolean | null;
}

/**
 * Detects if the user is on a Mac platform.
 * Returns null during SSR, then resolves to boolean on client.
 */
export function usePlatformDetection(): UsePlatformDetectionResult {
  const [isMac, setIsMac] = useState<boolean | null>(null);

  useEffect(() => {
    const platform =
      (navigator as Navigator & { userAgentData?: { platform: string } })
        .userAgentData?.platform ?? navigator.platform;
    setIsMac(/mac/i.test(platform));
  }, []);

  return { isMac };
}
