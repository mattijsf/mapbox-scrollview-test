/* eslint-disable react-native/no-inline-styles */
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet"
import Mapbox from "@react-native-mapbox-gl/maps"
import React, { useCallback, useMemo, useRef, useState } from "react"
import {
  Button,
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native"
import { Pager } from "./Pager"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
})

const MapboxScrollViewBug = () => {
  const { width: windowWidth } = useWindowDimensions()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ["40%", "80%"], [])

  const pageContainer = useMemo(
    (): ViewStyle => ({
      width: windowWidth,
      alignItems: "center",
      justifyContent: "space-around",
    }),
    [windowWidth]
  )

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const pagerRef = useRef<Pager>(null)
  const [contentPanningEnabled, setContentPanningEnabled] = useState(true)
  const timerRef = useRef<NodeJS.Timeout>()

  const onMapTouch = useCallback((event: GestureResponderEvent) => {
    clearTimeout(timerRef.current)
    if (event.nativeEvent.touches.length > 0) {
      pagerRef.current?.setEnabled(false)
      setContentPanningEnabled(false)
    } else {
      timerRef.current = setTimeout(() => {
        pagerRef.current?.setEnabled(true)
        setContentPanningEnabled(true)
      }, 500)
    }
  }, [])

  const PagerContainer = useMemo(() => {
    return (
      <View style={styles.container}>
        <Pager style={{ flex: 1 }} pageWidth={windowWidth} ref={pagerRef}>
          <View style={[pageContainer, { backgroundColor: "aqua" }]}>
            <View
              style={{ width: "100%", height: "50%" }}
              onTouchStart={onMapTouch}
              onTouchEnd={onMapTouch}
            >
              <Mapbox.MapView collapsable={false} style={StyleSheet.absoluteFill} />
            </View>
            <Text>Slide 1</Text>
          </View>
          <View style={[pageContainer, { backgroundColor: "beige" }]}>
            <Text>Slide 2</Text>
          </View>
          <View style={[pageContainer, { backgroundColor: "coral" }]}>
            <Text>Slide 3</Text>
          </View>
        </Pager>
      </View>
    )
  }, [onMapTouch, pageContainer, windowWidth])

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/* {PagerContainer} */}
        <Button onPress={handlePresentModalPress} title="Present Modal" color="black" />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableContentPanningGesture={contentPanningEnabled}
        >
          <BottomSheetView style={styles.contentContainer}>{PagerContainer}</BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}

export default MapboxScrollViewBug
