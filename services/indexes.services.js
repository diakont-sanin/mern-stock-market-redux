const fetch = require('node-fetch')

const _apiBase = `https://bcs-express.ru/webapi/api/quotes?securCode=`
const getIndexes = async (item) => {
  const res = await fetch(`${_apiBase}${item}`)
  if (!res.ok) {
    throw new Error(
      `Could not fetch ${_apiBase}${item}, received ${res.status}`
    )
  }
  return await res.json()
}

const getIndex = async (id) => {
  const ticker = await getIndexes(`${id}`)

  return ticker
}

module.exports = getIndex
