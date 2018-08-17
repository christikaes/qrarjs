const express = require('express')
const app = express()


// app.use((req, res, next) => {
//     res.append('Content-Security-Policy', "script-src 'self' 'unsafe-inline' 'unsafe-eval'");
//     next();
// })

app.use(express.static('dist'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))