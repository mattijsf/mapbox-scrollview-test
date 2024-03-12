import React, { useMemo } from "react"
import { View, ViewStyle } from "react-native"
import { Gesture, GestureDetector, PanGesture } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

type PagerProps = {
  children: React.ReactNode
  pageWidth: number
  style: ViewStyle
  panGestureRef?: React.MutableRefObject<PanGesture>
}

export function Pager({ children, style, pageWidth }: PagerProps): React.JSX.Element {
  const dragStart = useSharedValue(0)
  const x = useSharedValue(0)

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(10)
        .failOffsetY([-10, 10])
        .enabled(true)
        .onStart(_ => {
          dragStart.value = x.value
        })
        .onUpdate(event => {
          const newX = dragStart.value + event.translationX
          x.value = newX
        })
        .onFinalize(event => {
          const newX = pageWidth * Math.round(x.value / pageWidth)
          x.value = withSpring(newX, { velocity: event.velocityX, damping: 15, stiffness: 150 })
        }),
    [dragStart, pageWidth, x]
  )

  const containerStyle = useAnimatedStyle(
    () => ({
      flex: 1,
      width: pageWidth,
      flexDirection: "row",
      marginLeft: x.value,
    }),
    []
  )

  return (
    // <NativeViewGestureHandler disallowInterruption={true} shouldActivateOnStart={true}>
    <View style={style}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={containerStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
    // </NativeViewGestureHandler>
  )
}
