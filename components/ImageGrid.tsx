import { StyleSheet, View } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./ImageCard";
import { getColumnCount, wp } from "@/helpers/common";
import { ExpoRouter } from "expo-router/types/expo-router";

const ImageGrid: React.FC<{ images: any, router: ExpoRouter.Router }> = ({ images, router }) => {
  const columns = getColumnCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        renderItem={({ item, index }) => (
          <ImageCard item={item} index={index} columns={columns} router={router} />
        )}
        estimatedItemSize={200}
        contentContainerStyle={styles.listContainerStyle}
      />
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
});
