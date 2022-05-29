const functions = require('@google-cloud/functions-framework');
const fetch = require('node-fetch');
const { WritableStream } = require("htmlparser2/lib/WritableStream");

functions.http('rsslookup', async (req, res) => {
    if (req.headers['authorization'] != process.env.AUTH_TOKEN) {
        console.log("Tried to bypass Cloudflare!")
        res.setHeader('content-type', 'application/json');
        res.status(403).send(JSON.stringify({
            "status": "403",
            "message": "No!"
        }));
    }

    if (req.body.url === undefined) {
        console.log("Must pass in a URL body tag!")
        res.setHeader('content-type', 'application/json');
        res.status(500).send(JSON.stringify({
            "status": "500",
            "url": "You must pass a URL tag in the body!"
        }));
    }

    let url = req.body.url;

    if (url.slice(-1) === '/') {
        url = url.slice(0, -1);
    }

    const response = await fetch(url).catch(error => {
        console.log("Unable to find URL")
        res.setHeader('content-type', 'application/json');
        res.status(404).send(JSON.stringify({
            "status": "404",
            "message": "We can't find anything on this URL!"
        }));
    });;

    const feeds = new Set();

    if (!response.ok) {
        console.log("Unable to find URL")
        res.setHeader('content-type', 'application/json');
        res.status(404).send(JSON.stringify({
            "status": "404",
            "message": "We can't find anything on this URL!"
        }));
    }

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

    await response.body.pipe(parserStream);

    if (feeds.size == 0) {
        const feedResponse = await fetch(url + '/feed/');

        if (feedResponse.status == 200) {
            feeds.add(url + '/feed/');
        }
    }

    if (feeds.size == 0) {
        console.log("Unable to find any feeds on site.")
        res.setHeader('content-type', 'application/json');
        res.status(404).send(JSON.stringify({
            "status": "404",
            "url": "Sorry, we couldn't find any RSS feeds on this site!"
        }));
    }

    const result = [];

    for (let feed of feeds) {
        result.push(feed);
    }

    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(result));
});
