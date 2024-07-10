const categories = [
  "backgrounds",
  "fashion",
  "nature",
  "science",
  "education",
  "feelings",
  "health",
  "people",
  "religion",
  "places",
  "animals",
  "industry",
  "computer",
  "food",
  "sports",
  "transportation",
  "travel",
  "buildings",
  "business",
  "music"
];

const filters = {
  order: ["popular", "latest"],
  orientation: ["horizontal", "vertical"],
  type: ["photo", "ilustration", "vector"],
  colors: [
    "red",
    "orange",
    "yellow",
    "green",
    "turquoise",
    "blue",
    "pink",
    "gray",
    "black",
    "brown",
    "white"
  ]
}

type DataType = {
  categories: string[],
  filters: {
      order: string[],
      orientation: string[],
      type: string[],
      colors: string[],
  }
}
export type FilterKeys = keyof DataType['filters'];

export const data: DataType = {
  categories,
  filters
}