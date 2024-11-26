const { app } = require('./serverConfig')
const router = require('./endpoints')

app.use('/fms-api', router);

app.listen(3000, () => {console.log('Server is running on port 3000')});