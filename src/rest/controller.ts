import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://discord.com/api/v9/',
  httpsAgent: null,
  timeout: 15_000
})