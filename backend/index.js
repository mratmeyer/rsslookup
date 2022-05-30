const PORT = 8080;

// Initialize express server
const express = require('express');
const app = express();

// Initialize CORS
const cors = require('cors');

// Initialize node-fetch, hcaptcha, and htmlparser2
const fetch = require('node-fetch');
const {verify} = require('hcaptcha');
const {WritableStream} = require("htmlparser2/lib/WritableStream");

// Initialize express plugins
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/*', async (req, res) => {
    const ip = req.get('Fly-Client-IP')
    const region = req.get('Fly-Region')
    const debug = " (" + ip + ", " + region + ")"

    // Block all non-POST or OPTIONS requests
    if (!(req.method === 'POST' || req.method === 'OPTIONS')) {
        console.log("Failed Request: Request must be POST or OPTIONS" + debug)
        res.setHeader('content-type', 'application/json');
        return res.status(500).send(JSON.stringify({
            "status": "500",
            "message": "Request must be POST or OPTIONS"
        }));
    }

    // Accept all OPTIONS requests
    if (req.method === 'OPTIONS') {
        console.log("Successful Request: Responding to preflight" + debug)
        return res.status(200).send();
    }

    // Block if no hcaptcha token
    if (req.body.hcaptcha === undefined) {
        console.log("Failed Request: No hcaptcha token!" + debug)
        res.setHeader('content-type', 'application/json');
        return res.status(500).send(JSON.stringify({
            "status": "500",
            "message": "No hcaptcha token!"
        }));
    }

    // Process hcaptcha
    verify(process.env.HCAPTCHA_SECRET, req.body.hcaptcha).then((data) => {
        if (data.success !== true) {
            console.log('Failed Request: Request failed captcha' + debug);
            res.setHeader('content-type', 'application/json');
            return res.status(500).send(JSON.stringify({
                "status": "500",
                "message": "Failed captcha!"
            }));
        }
    }).catch(console.error);

    // Check if URL has been passed
    if (req.body.url === undefined) {
        console.log("Failed Request: Must pass in a URL body tag!" + debug)
        res.setHeader('content-type', 'application/json');
        return res.status(500).send(JSON.stringify({
            "status": "500",
            "url": "Must pass a URL tag in the body!"
        }));
    }

    // If error during fetch, return error
    const response = await fetch(req.body.url).catch(error => {
        console.log("Failed Request: Invalid URL" + debug)
        res.setHeader('content-type', 'application/json');
        return res.status(500).send(JSON.stringify({
            "status": "500",
            "message": "We were unable to access this URL!"
        }));
    });;

    const feeds = new Set();

    // If response not successful, return error
    if (!response.ok) {
        console.log("Failed Request: Invalid URL" + debug)
        res.setHeader('content-type', 'application/json');
        return res.status(500).send(JSON.stringify({
            "status": "500",
            "message": "We were unable to access this URL!"
        }));
    }

    // Strip non-domain characters
    const url = response.url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img);

    // Parse through stream
    const parserStream = new WritableStream({
        onopentag(name, attributes) {
            if (name === "link") {
                // Look for RSS link tags
                if (attributes.type === "application/rss+xml" || attributes.type === "application/atom+xml" || attributes.type === "application/rss&#re;xml") {
                    let feedURL = attributes.href;

                    // If feed URL starts with /
                    if (feedURL.charAt(0) == '/') {
                        // If URL ends with /, remove it for consistency
                        if (url.slice(-1) === '/') {
                            feedURL = url.slice(0, -1) + feedURL;
                        } else {
                            feedURL = url + feedURL;
                        }
                    }

                    // If URL isn't a valid URL, append domain
                    if (feedURL.search(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/) === -1) {
                        feedURL = url + "/" + feedURL;
                    }

                    feeds.add(feedURL);
                }
            }
        },
    });

    // On finish, execute rest of code
    response.body.pipe(parserStream).on("finish", async () => {
        // If no feeds have been found yet, check /feed/
        if (feeds.size == 0) {
            const feedResponse = await fetch(url + '/feed/');

            if (feedResponse.status == 200) {
                feeds.add(feedResponse.url);
            }
        }

        // If no feeds have still been found yet, check /rss/
        if (feeds.size == 0) {
            const feedResponse = await fetch(url + '/rss/');

            if (feedResponse.status == 200) {
                feeds.add(feedResponse.url);
            }
        }

        // If still no feeds, return error that no feeds found
        if (feeds.size == 0) {
            console.log("Failed Request: Unable to find any feeds on site" + debug)
            res.setHeader('content-type', 'application/json');
            return res.status(500).send(JSON.stringify({
                "status": "500",
                "message": "Sorry, we couldn't find any RSS feeds on this site!"
            }));
        }

        const result = {
            "status": "200",
            "result": []
        }

        for (let feed of feeds) {
            result["result"].push(feed);
        }

        console.log("Successful Request: Returned " + feeds.size + " result(s)" + debug)
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
    });
    
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
