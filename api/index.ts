import axios from 'axios';

const API_KEY = '20754659-d76bd742cfe406da8c4ac4435'

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`

const formatUrl = (params: any) => {
  let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true"
  if (!params) return url;
  let paramKeys = Object.keys(params);
  paramKeys.map(key => {
    let value = key === 'q' ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  console.log('final url', url);
  return url;
}

export const apiCall = async (params: any) => {
  try {
    const response = await axios.get(formatUrl(params))
    const { data } = response;
    return { success: true, data }
  } catch (error) {
    console.log(error)
    return { success: false, msg: error}
  }
}