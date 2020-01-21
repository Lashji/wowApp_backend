const express = require("express")
const app = express();

app.use(express.json())

require('./router.js')(app)
app.listen(3000, () => console.log("app listening at port 3000!"));