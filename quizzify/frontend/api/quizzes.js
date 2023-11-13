import { getRequest, postRequest, putRequest, deleteRequest } from "./index"

const BASE_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/quizzes`

const SINGLE_CHOICE = "SINGLE_CHOICE"
const MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
const TRUE_OR_FALSE= "TRUE_OR_FALSE"
const FILL_BLANK = "FILL_BLANK"

export const QUIZ_TYPES = {SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_OR_FALSE, FILL_BLANK}

export const getQuizzes = async (accessToken) => {
  return await getRequest(BASE_API_URL, accessToken)
}

export const createQuiz = async (accessToken, data) => {
  return await postRequest(BASE_API_URL, accessToken, data)
}