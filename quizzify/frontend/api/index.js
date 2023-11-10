const headers = (accessToken) => ({
  'Content-Type': 'application/json',
  // 'Accepts-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`,
})

export const getRequest = (url, accessToken="") => {
  return fetch(url, {
    method: 'GET',
    headers: headers(accessToken)
  })
    .then(response => Promise.all([response, response.json()]))
    .catch(error => { throw error })
}

export const postRequest = (url, accessToken="", data) => {
  return fetch(url, {
    method: 'POST',
    headers: headers(accessToken),
    body: JSON.stringify(data)
  })
    .then(response => Promise.all([response, response.json()]))
    .catch(error => { throw error })
}

export const putRequest = (url, accessToken="", data) => {
  return fetch(url, {
    method: 'PUT',
    headers: headers(accessToken),
    body: JSON.stringify(data)
  })
    .then(response => Promise.all([response, response.json()]))
    .catch(error => { throw error })
}

export const deleteRequest = (url, accessToken="") => {
  return fetch(url, {
    method: 'DELETE',
    headers: headers(accessToken)
  })
    .then(response => Promise.all([response, response.json()]))
    .catch(error => { throw error })
}