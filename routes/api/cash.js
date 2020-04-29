const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth')
const Cash = require('../../models/Cash')

router.post('/', auth, async (req, res) => {
  try {
    const { usd, rub } = req.body
    const valid = usd !== '' || rub !== ''
    const exist = await (await Cash.find({ owner: req.user.id })).length
    console.log(exist)
    if (valid && !exist) {
      await new Cash({
        usd,
        rub,
        owner: req.user.id,
      }).save()
      res
        .status(201)
        .json({ message: `Добавлено в портфель ${usd} usd, ${rub || 0} rub` })
    } else if (valid && exist) {
      await Cash.find({ owner: req.user.id }).then((item) =>
        item.map(async (item) => {
          await Cash.findOneAndUpdate(
            {
              _id: item._id,
            },
            {
              $set: {
                rub: item.rub + rub,
                usd: item.usd + usd,
              },
            }
          )
        })
      )
      res.status(201).json({
        message: `Добавлено в портфель ${usd || 0} usd, ${rub || 0} rub`,
      })
    } else {
      res.status(500).json({ message: 'Не заполнены поля' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так' })
  }
})

module.exports = router