import { getRequest, postRequest, putRequest, deleteRequest } from "./index"

const BASE_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/quizzes`

export const getQuizzes = async (accessToken) => {
  return await getRequest(BASE_API_URL, accessToken)
}

export const createQuiz = async (accessToken, data) => {
  return await postRequest(BASE_API_URL, accessToken, data)
}

export const getQuizById = async (accessToken, selectedQuizId) => {
  return await getRequest(`${BASE_API_URL}/${selectedQuizId}`, accessToken)
}

export const copyQuizById = async (accessToken, selectedQuizId) => {
  return await getRequest(`${BASE_API_URL}/${selectedQuizId}/copy`, accessToken)
}