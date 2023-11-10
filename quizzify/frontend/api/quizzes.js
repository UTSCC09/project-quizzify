import { getRequest, postRequest, putRequest, deleteRequest } from "./index"

const BASE_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/quizzes`

export const getQuizzes = async (accessToken) => {
  return await getRequest(BASE_API_URL, accessToken)
}