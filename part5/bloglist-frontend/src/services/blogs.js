import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token =`Bearer ${newToken}`

}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async content => {

  const config = {
    headers: {Authorization: token},
  }


  const request = await axios.post(baseUrl, content, config)
  return request.data
  
}

const update = async (id, updatedBlog) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedBlog);
    return response.data;
}

const deleteThisBlog = async (id) => {
  const config = {
    headers: {Authorization: token},
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data



}

export default { getAll, setToken, create, update, deleteThisBlog }