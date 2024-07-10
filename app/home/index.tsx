import { useState, useRef, useCallback, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { debounce, filter } from "lodash";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Categories from "@/components/Categories";
import { FONT_WEIGHT_SEMIBOLD, theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { Nullable } from "@/constants/types";
import { apiCall } from "@/api";
import ImageGrid from "@/components/ImageGrid";
import FiltersModal from "@/components/FiltersModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";

let page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30; //checking for notch
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<Nullable<string>>(null);
  const [images, setImages] = useState<Array<any>>([]);
  const [filters, setFilters] = useState<any>(null);
  const [isEndReached, setIsEndReached] = useState(false);

  const searchInputRef = useRef<TextInput>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const scrollRef = useRef<ScrollView>(null);

  const router = useRouter();

  useEffect(() => {
    fetchImages();
  }, []);

  interface FetchImagesParams {
    page?: number;
    q?: string;
    [key: string]: any; // Allows for additional properties
  }

  const fetchImages = async (
    params: FetchImagesParams = { page: 1 },
    append = false
  ) => {
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      if (append) setImages([...images, ...res.data.hits]);
      else setImages(res.data.hits);
    }
  };

  const handleChangeCategory = (cat: Nullable<string>) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params: any = {
      page,
      ...filters,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length > 2) {
      // search for this text
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }

    if (text === "") {
      // reset results
      page = 1;
      searchInputRef.current?.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.clear();
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const openFiltersModal = () => {
    modalRef.current?.present();
  };

  const closeFiltersModal = () => {
    modalRef.current?.close();
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params = { ...params, category: activeCategory };
      if (search) params = { ...params, q: search };
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params: any = {
        page,
      };
      if (activeCategory) params = { ...params, category: activeCategory };
      if (search) params = { ...params, q: search };
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const clearThisFilter = (filterName: string) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params = { ...params, category: activeCategory };
    if (search) params = { ...params, q: search };
    fetchImages(params, false);
  };

  const handleScrollUp = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollViewOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollViewOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        console.log("reached bottom of scrollview");
        // fetch more images
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params = { ...params, category: activeCategory };
        if (search) params = { ...params, q: search };
        fetchImages(params, true);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  console.log("filters", filters);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{ gap: 15 }}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={5}
      >
        {/* search bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            style={styles.searchInput}
            // value={search}
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
          />
          {search && (
            <Pressable
              style={styles.closeIcon}
              onPress={() => handleSearch("")}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        {/* categories */}
        <View>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* filters visualization */}
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key === "colors" ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      />
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}
                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* images grid */}
        <View>{images.length > 0 && <ImageGrid images={images} router={router} />}</View>

        {/* loading */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>
      {/* Filters */}
      <FiltersModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        onApply={applyFilters}
        onClose={closeFiltersModal}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: FONT_WEIGHT_SEMIBOLD,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.xs,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.grayBG,
    padding: 8,
    borderRadius: theme.radius.xs,
  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
    padding: 8,
    paddingHorizontal: 10,
    gap: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});
