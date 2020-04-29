const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth')
const getDetail = require('../../services/details.services')
const getPrices = require('../../services/prices.services')
const getDividend = require('../../services/devidend.services')
const getChart = require('../../services/chart.services')
const HoldList = require('../../models/HoldList')
var Mongoose = require('mongoose')
var ObjectId = Mongoose.Types.ObjectId

router.get('/', auth, async (req, res) => {
  try {
    const result = []
    await HoldList.aggregate([
      {
        $match: {
          owner: new ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: '$ticker',
          avgPrice: {
            $sum: { $multiply: ['$price', '$quantity'] },
          },
          sum: { $sum: '$quantity' },
        },
      },
    ]).then(async (item) => {
      const promises = item.map(async (item) => {
        const prices = await getPrices(item._id)

        return { ...prices, ...item }
      })
      const results = await Promise.all(promises)
      results.map((itm) => {
        result.push({
          c: itm.c.pop(),
          o: itm.o.pop(),
          _id: itm._id,
          avgPrice: itm.avgPrice,
          sum: itm.sum,
        })
      })
    })

    const sorted = result.sort((a, b) => {
      const getPercent = (open, close) => {
        return ((close / open) * 100 - 100).toFixed(2)
      }
      //let nameA = a._id
      let nameA = getPercent(a.o, a.c)
      let nameB = getPercent(b.o, b.c)
      if (nameA > nameB)
        //сортируем строки по возрастанию
        return -1
      if (nameA < nameB) return 1
      return 0 // Никакой сортировки
    })
    res.json(sorted)
  } catch (err) {
    res.status(500).json({ message: 'Что-то пошло не так' })
  }
})

router.get('/:id', auth, async (req, res) => {
  
  try {
    const result = []
    const dividend = await getDividend(req.params.id)
    const details = await getDetail(req.params.id)
    //const chart = await getChart(req.params.id,'7')
    const chart = {
      D: await getChart(req.params.id, 'D'),
      W: await getChart(req.params.id, 'W'),
      M: await getChart(req.params.id, 'M'),
      Y: await getChart(req.params.id, 'Y'),
      Q: await getChart(req.params.id, 'Q'),
    }
    await HoldList.find({
      ticker: req.params.id,
      owner: req.user.id,
    }).then((transactions) => {
      result.push({ transactions, dividend, chart,details })
    })
    
    res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { ticker, price, quantity, side } = req.body
    const valid = ticker !== '' && price !== '' && quantity !== ''

    if (side === 'Sell' && valid) {
      await getDetail(ticker).then(async (items) => {
        await new HoldList({
          ticker,
          price,
          quantity: quantity * -1,
          side,
          owner: req.user.id,
          date: Date.now(),
          ...items,
        }).save()
      })
      res.status(201).json({ message: 'Добавлено в портфель' })
    } else if (valid) {
      await getDetail(ticker).then(async (items) => {
        await new HoldList({
          ticker,
          price,
          quantity,
          side,
          owner: req.user.id,
          date: Date.now(),
          ...items,
        }).save()
      })
      res.status(201).json({ message: 'Добавлено в портфель' })
    } else {
      res.status(500).json({ message: 'Заполнены не все поля' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так' })
  }
})

module.exports = router
