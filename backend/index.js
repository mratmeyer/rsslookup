const functions = require('@google-cloud/functions-framework');
const fetch = require('node-fetch');
const { WritableStream } = require("htmlparser2/lib/WritableStream");

functions.http('rsslookup', async (req, res) => {
    if (req.body.url === undefined) {
        console.log("Must pass in a URL body tag!")
        res.setHeader('content-type', 'application/json');
        res.status(500);
        res.send(JSON.stringify({
            "status": "500"
        }));
    }

    let url = req.body.url;

    if (url.slice(-1) === '/') {
        url = url.slice(0, -1);
    }

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

    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(result));
});
