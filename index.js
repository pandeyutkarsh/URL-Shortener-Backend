const express = require('express')
const cors = require('cors');
const { connectToMongoDB } = require('./connect')
const urlRoute = require('./routes/url')
const URL = require('./models/url')
const app = express()
const port = 8001

app.use(cors());

connectToMongoDB("mongodb+srv://pandeyutkarsh328:root@cluster0.jxztnpd.mongodb.net/?retryWrites=true&w=majority").then(
    ()=>{
        console.log("MongoDB connected");
    }
)

app.use(express.json())
app.use('/',urlRoute)

app.get("/:shortId", async (req,res) => {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate({
            shortId,
        },{
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        });

        if (!entry) {
            return res.status(404).json({ error: "URL not found" });
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(port,()=>{
    console.log(`Server started at ${port}`)
})