const app = require ('./app')
const config = require ('config')

const  PORT  = config.get('PORT')

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
