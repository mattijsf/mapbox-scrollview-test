/* eslint-disable react-native/no-inline-styles */
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet"
import Mapbox from "@rnmapbox/maps"
import React, { useCallback, useMemo, useRef } from "react"
import { Button, StyleSheet, Text, View, ViewStyle, useWindowDimensions } from "react-native"
import { Pager } from "./Pager"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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
  const snapPoints = useMemo(() => ["25%", "50%"], [])

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

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Button onPress={handlePresentModalPress} title="Present Modal" color="black" />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Pager style={{ flex: 1 }} pageWidth={windowWidth}>
              <View style={[pageContainer, { backgroundColor: "aqua" }]}>
                <Mapbox.MapView
                  style={{ width: "100%", height: "50%" }}
                  requestDisallowInterceptTouchEvent
                />
                <Text>Slide 1</Text>
              </View>
              <View style={[pageContainer, { backgroundColor: "beige" }]}>
                <Text>Slide 2</Text>
              </View>
              <View style={[pageContainer, { backgroundColor: "coral" }]}>
                <Text>Slide 3</Text>
              </View>
            </Pager>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}

export default MapboxScrollViewBug
