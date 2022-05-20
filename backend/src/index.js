const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const port = 8080;

const fetch = require('node-fetch');
const { WritableStream } = require("htmlparser2/lib/WritableStream");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/*', async (req, res) => {
    if (req.body.url == null) {
        res.send("no url");
    }

    const url = req.body.url;

    const response = await fetch(url);
    const feeds = new Set();

    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

    const parserStream = new WritableStream({
        onopentag(name, attributes) {
            if (name === "link") {
                if (attributes.type === "application/rss+xml" || attributes.type === "application/atom+xml" || attributes.type === "application/rss&#re;xml") {
                    let feedURL = attributes.href;

                    if (feedURL.charAt(0) == '/') {
                        feedURL = url + feedURL;
                    }

                    feeds.add(feedURL);
                }
            }
        },
    });

    response.body.pipe(parserStream).on("finish", () => {
        console.log("done")
    });

    const response2 = await fetch(url + '/feed/');

    if (response2.status == 200) {
        feeds.add(url + '/feed/');
    }

    const result = [];

    for (let feed of feeds) {
        result.push(feed);
    }

    res.send(JSON.stringify(result));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
