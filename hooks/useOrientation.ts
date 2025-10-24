import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const { width, height } = window;
      setIsLandscape(width > height);
      setDimensions({ width, height });
    });

    const { width, height } = Dimensions.get('window');
    setIsLandscape(width > height);
    setDimensions({ width, height });

    return () => subscription?.remove();
  }, []);

  return { isLandscape, dimensions };
}