import React, { useRef, useEffect, ReactNode } from "react";
import { Animated } from "react-native";

type AnimatedCardProps = {
  children: ReactNode;
  currentIndex: number;
  matches: any[]; // you can replace `any` with your real type
};

export default function AnimatedCard({
  children,
  currentIndex,
  matches,
}: AnimatedCardProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (matches[currentIndex]) {
      scaleAnim.setValue(0);

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex, matches]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
}
