import { getRequest, postRequest, putRequest, deleteRequest } from "./index"

const BASE_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users`

export const getUserById = async (accessToken, userId) => {
  return await getRequest(`${BASE_API_URL}/${userId}`, accessToken)
}

export const getQuizzesByUserId = async (accessToken, userId) => {
  return await getRequest(`${BASE_API_URL}/${userId}/quizzes`, accessToken)
}