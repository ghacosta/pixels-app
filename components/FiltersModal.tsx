import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { hp } from "@/helpers/common";
import { FONT_WEIGHT_SEMIBOLD, theme } from "@/constants/theme";
import { ColorFilterRow, CommonFilterRow, SectionView } from "./FilterViews";
import { capitalize } from "lodash";
import { data, FilterKeys } from "@/constants/data";
import { Dispatch, RefObject, SetStateAction } from "react";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

interface FiltersModalProps {
  modalRef: RefObject<BottomSheetModalMethods>;
  filters: any;
  setFilters: Dispatch<SetStateAction<null>>;
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}) => {
  return (
    <BottomSheetModal
      ref={modalRef}
      index={1}
      snapPoints={["50%", "75%"]}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((section, index) => {
            const sectionName = section as FilterKeys;
            let sectionView = sections[sectionName];
            let sectionData = data.filters[sectionName];
            let title = capitalize(sectionName);
            return (
              <Animated.View entering={FadeInDown.delay((index*100)+100).springify().damping(11)} key={sectionName}>
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}

          {/* actions */}
          <Animated.View entering={FadeInDown.delay(500).springify().damping(11)} style={styles.buttons}>
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9)}]}>Reset</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText, { color: theme.colors.white}]}>Apply</Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  order: (props: any) => <CommonFilterRow {...props} />,
  orientation: (props: any) => <CommonFilterRow {...props} />,
  type: (props: any) => <CommonFilterRow {...props} />,
  colors: (props: any) => <ColorFilterRow {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];

  return (
    <Animated.View style={containerStyle}>
      {/* blur view */}
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </Animated.View>
  );
};

export default FiltersModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    // width: "100%",
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: FONT_WEIGHT_SEMIBOLD,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: "continuous"
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: theme.colors.grayBG
  },
  buttonText: {
    fontSize: hp(2)
  }
});
