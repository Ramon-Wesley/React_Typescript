import axios from 'axios'
import { Environment } from '../../../environment/Environment'
import { axiosErrorInterceptor, axiosResponseInterceptor } from './interceptors'

const api=axios.create({
    baseURL:Environment.URL_BASE
})

api.interceptors.response.use(
    (response)=>axiosResponseInterceptor(response),
    (error)=>axiosErrorInterceptor(error)
)

export {api}