const { Router } = require('express')
const auth = require('../../middleware/auth')
const getIndex = require('../../services/indexes.services')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const indexes = []

    await getIndex('BRENT').then((brent) => indexes.push(brent))
    await getIndex('USD000UTSTOM').then((rub) => indexes.push(rub))
    await getIndex('S%26P500').then((snp) => indexes.push(snp))
    await getIndex('IMOEX').then((moex) => indexes.push(moex))

    res.status(200).json(indexes)
  } catch (err) {
    res.status(500).json({ message: 'Что-то пошло не так' })
  }
})

module.exports = router
