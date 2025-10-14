import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export function useScreenOrientation(
  lockOrientation: ScreenOrientation.OrientationLock = ScreenOrientation.OrientationLock.PORTRAIT_UP
) {
  useEffect(() => {
    let isMounted = true;

    async function lock() {
      try {
        const supported = await ScreenOrientation.supportsOrientationLockAsync(lockOrientation);

        if (!supported) {
          console.warn(`Orientation ${lockOrientation} not supported on this device.`);
          return;
        }

        await ScreenOrientation.lockAsync(lockOrientation);
      } catch (err) {
        console.error('Error locking orientation:', err);
      }
    }

    lock();

    return () => {
      if (isMounted) {
        ScreenOrientation.unlockAsync().catch(console.error);
      }
      isMounted = false;
    };
  }, [lockOrientation]);
}