import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react"
import { View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

export type Pager = {
  setEnabled(enable: boolean): void
}

type PagerProps = {
  children: React.ReactNode
  pageWidth: number
  style: ViewStyle
}

type PagerContextType = Pager
const PagerContext = React.createContext<PagerContextType>({
  setEnabled: () => {
    throw new Error(
      "Pager component not found. Did you forget to wrap your component with <Pager>?"
    )
  },
})

export const usePager = (): PagerContextType => React.useContext(PagerContext)

export const Pager = forwardRef<Pager, PagerProps>(
  ({ children, style, pageWidth }, ref): React.JSX.Element => {
    const dragStart = useSharedValue(0)
    const x = useSharedValue(0)
    const shouldEnable = useSharedValue(true)
    const [enablePanning, setEnablePanning] = useState(true)

    const panGesture = useMemo(
      () =>
        Gesture.Pan()
          .enabled(enablePanning)
          .cancelsTouchesInView(true)
          .minDistance(10) // required to work nicely with bottom sheet content panning
          .failOffsetY(10) // required to work nicely with bottom sheet content panning
          .onStart(_ => {
            dragStart.value = x.value
          })
          .onUpdate(event => {
            if (!shouldEnable.value) {
              x.value = dragStart.value
              return
            }

            const newX = dragStart.value + event.translationX
            x.value = newX
          })
          .onFinalize(event => {
            if (!shouldEnable.value) {
              x.value = dragStart.value
              return
            }
            const newX = pageWidth * Math.round(x.value / pageWidth)
            x.value = withSpring(newX, { velocity: event.velocityX, damping: 15, stiffness: 150 })
          }),
      [dragStart, enablePanning, pageWidth, shouldEnable.value, x]
    )

    const setEnabled = useCallback(
      (enabled: boolean) => {
        panGesture.enabled(enabled)
        setEnablePanning(enabled)
        shouldEnable.value = enabled
      },
      [panGesture, shouldEnable]
    )

    useEffect(() => {
      console.log({ enablePanning })
    }, [enablePanning])

    useImperativeHandle(
      ref,
      () => ({
        setEnabled,
      }),
      [setEnabled]
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

    const pagerContextValue = useMemo((): PagerContextType => ({ setEnabled }), [setEnabled])

    return (
      <PagerContext.Provider value={pagerContextValue}>
        <View style={style}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={containerStyle} collapsable={false}>
              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </PagerContext.Provider>
    )
  }
)
