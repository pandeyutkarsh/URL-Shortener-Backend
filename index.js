const express = require('express')
const { connectToMongoDB } = require('./connect')
const urlRoute = require('./routes/url')
const URL = require('./models/url')
const app = express()
const port = 8001

connectToMongoDB("mongodb+srv://pandeyutkarsh328:root@cluster0.jxztnpd.mongodb.net/?retryWrites=true&w=majority").then(
    ()=>{
        console.log("MongoDB connected");
    }
)
app.use(express.json())
app.use('/',urlRoute)

app.get("/:shortId", async (req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },{
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    })
    res.redirect(entry.redirectURL)
})

app.listen(port,()=>{
    console.log(`Server started at ${port}`)
})