import { Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { getImageSize, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import { ExpoRouter } from 'expo-router/types/expo-router';

interface ImageCardProps {
  item: any;
  index: number;
  columns: number;
  router: ExpoRouter.Router
}

const ImageCard: React.FC<ImageCardProps> = ({ item, index, columns, router }) => {
  const isLastInRow = () => {
    return (index + 1) % columns === 0;
  }

  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return {
      height: getImageSize(height, width)
    }
  }

  return (
    <Pressable onPress={() => router.push({ pathname: "home/image", params: {...item} })} style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}>
      <Image source={item?.webformatURL} style={[styles.image, getImageHeight()]} transition={100} />
    </Pressable>
  )
}

export default ImageCard

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%'
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: wp(2)
  }
})