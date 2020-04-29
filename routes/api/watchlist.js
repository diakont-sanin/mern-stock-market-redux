const { Router } = require('express')
const auth = require('../../middleware/auth')
const getDetail = require('../../services/details.services')
const getPrices = require('../../services/prices.services')
const getDividend = require('../../services/devidend.services')
const getChart = require('../../services/chart.services')
const WatchList = require('../../models/WatchList')

const router = Router()

/**
 * @route   GET api/items
 * @desc    Get All Items
 * @access  Public
 */

router.get('/', auth, async (req, res) => {
  try {
    const items = await WatchList.find({ owner: req.user.id })
    if (!items) throw Error('No items')

    const userWatching = []
    await WatchList.find({ owner: req.user.id }).then(async (item) => {
      const promises = item.map(async (item) => {
        const prices = await getPrices(item.ticker)

        return { ...prices, ...item }
      })
      const results = await Promise.all(promises)
      results.map((result) => {
        userWatching.push({
          _id: result._doc._id,
          ticker: result._doc.ticker,
          close: result.c.pop(),
          open: result.o.pop(),
        })
      })
    })

    res.status(200).json(userWatching)
  } catch (e) {
    res.status(400).json({ msg: e.message })
  }
})


/**
 * @route   GET api/:id
 * @desc    Get a item
 * @access  Public
 */

router.get('/:id', auth, async (req, res) => {
  try {
    const result = [];
    const dividend = await getDividend(req.params.id)
    const details = await getDetail(req.params.id)
    const chart = {
      D:await getChart(req.params.id,'D'),
      W:await getChart(req.params.id,'W'),
      M:await getChart(req.params.id,'M'),
      Y:await getChart(req.params.id,'Y'),
      Q:await getChart(req.params.id,'Q'),
    }
    
    await WatchList.find({
      ticker: req.params.id,
      owner: req.user.id
    }).then(item => {
      
      result.push({ item, dividend,chart,details })
    });
    
    //console.log(result)
    res.status(200).json(result)
  } catch (e) {
    res.status(400).json({ msg: e.message })
  }
})

/**
 * @route   POST api/items
 * @desc    Create An Item
 * @access  Private
 */

router.post('/', auth, async (req, res) => {
  const { name } = req.body

  const details = await getDetail(name).then((item) => item)

  const newItem = new WatchList({
    ticker: req.body.name,
    owner: req.user.id,
    ...details,
  })

  try {
    const item = await newItem.save()
    if (!item) throw Error('Something went wrong saving the item')

    res.status(200).json(item)
  } catch (e) {
    res.status(400).json({ msg: e.message })
  }
})

/**
 * @route   DELETE api/items/:id
 * @desc    Delete A Item
 * @access  Private
 */

router.delete('/:id', auth, async (req, res) => {
  
  try {
    const item = await WatchList.findOneAndRemove({
      ticker: req.params.id,
      owner: req.user.id
    })
    
    if (!item) throw Error('No item found')

    /*const removed = await item.remove()
    if (!removed)
      throw Error('Something went wrong while trying to delete the item')
*/
    res.status(200).json({ success: true })
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false })
  }
})




module.exports = router
