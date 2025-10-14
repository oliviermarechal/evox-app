import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const { width, height } = window;
      setIsLandscape(width > height);
    });

    const { width, height } = Dimensions.get('window');
    setIsLandscape(width > height);

    return () => subscription?.remove();
  }, []);

  return { isLandscape };
}