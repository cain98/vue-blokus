import axios from 'axios'
import { API_URL } from '../config'

export default {
  join: (id) => axios.get(`${API_URL}/room/join/${id}`),
  create: () => axios.get(`${API_URL}/room/create`),
  getRoom: (id) => axios.get(`${API_URL}/room/get/${id}`)
}
