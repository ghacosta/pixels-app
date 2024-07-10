import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { hp } from "@/helpers/common";
import { FONT_WEIGHT_MEDIUM, theme } from "@/constants/theme";
import { capitalize, filter } from "lodash";

export const SectionView = ({ title, content }: any) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

interface CommonFilterRowProps {
  filters: any;
  setFilters: Dispatch<SetStateAction<null>>;
  data: string[];
  filterName: string;
}

export const CommonFilterRow = ({
  data,
  filterName,
  filters,
  setFilters,
}: CommonFilterRowProps) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item) => {
          let isActive = filters && filters[filterName] === item;
          let backgroundColor = isActive
            ? theme.colors.neutral(0.7)
            : theme.colors.white;
          let color = isActive ? theme.colors.white : theme.colors.neutral(0.7);
          return (
            <Pressable
              key={item}
              style={[styles.outlinedButton, { backgroundColor }]}
              onPress={() => onSelect(item)}
            >
              <Text style={[{ color }]}>{capitalize(item)}</Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilterRow = ({
  data,
  filterName,
  filters,
  setFilters,
}: CommonFilterRowProps) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let borderColor = isActive
            ? theme.colors.neutral(0.4)
            : theme.colors.white;
          return (
            <Pressable key={item} onPress={() => onSelect(item)}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]}></View>
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outlinedButton: {
    padding: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
  },
  colorWrapper: {
    padding: 3,
    borderWidth: 2,
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
  },
  color: {
    height: 30,
    width: 40,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
});
