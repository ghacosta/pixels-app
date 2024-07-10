import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { data } from "@/constants/data";
import { hp, wp } from "@/helpers/common";
import { FONT_WEIGHT_MEDIUM, theme } from "@/constants/theme";
import { Nullable } from "@/constants/types";

interface CategoriesProps {
  activeCategory: Nullable<string>;
  handleChangeCategory: (arg0: Nullable<string>) => void;
}
const Categories: React.FC<CategoriesProps> = ({
  activeCategory,
  handleChangeCategory,
}) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatlistContainer}
      showsHorizontalScrollIndicator={false}
      data={data.categories}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          isActive={activeCategory === item}
          handleChangeCategory={handleChangeCategory}
          title={item}
          index={index}
        />
      )}
    />
  );
};

interface CategoryItemProps {
  title: string;
  index: number;
  isActive: boolean;
  handleChangeCategory: (arg0: Nullable<string>) => void;
}
const CategoryItem: React.FC<CategoryItemProps> = ({
  title,
  index,
  isActive,
  handleChangeCategory,
}) => {
  let color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  let backgroundColor = isActive
    ? theme.colors.neutral(0.8)
    : theme.colors.white;
  return (
    <Animated.View entering={FadeInRight.delay(index * 200).duration(1000).springify().damping(14)}>
      <Pressable
        onPress={() => handleChangeCategory(isActive ? null : title)}
        style={[styles.category, { backgroundColor }]}
      >
        <Text style={[styles.title, { color }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    // backgroundColor: theme.colors.white
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
});
