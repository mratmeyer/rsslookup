import { cleanURL } from './urlUtils.js';


/**
 * Parses URL for hardcoded rules to find potential feed URLs.
 * @param {string} fullURL - The full URL path.
 * @param {string} hostname - The site hostname.
 * @param {Set<string>} feedsSet - The Set to add found feed URLs to.
 */
export function parseURLforRules(fullURL, hostname, feedsSet) {
    try {
        const cleanedURL = cleanURL(fullURL);
        if (!cleanedURL) return;

        let urlObject;
        let path = '';
        let origin = '';
        try {
            urlObject = new URL(cleanedURL);
            path = urlObject.pathname;
            origin = urlObject.origin;
        } catch(e) {
            console.error(`Error in parsing the cleaned URL in ruleUtils`);
        }


        // Rule: Reddit
        if (hostname === 'www.reddit.com' || hostname === 'reddit.com') {
            if (path == '/') { // If root domain, add the trailing slash
                feedsSet.add(cleanedURL + "/.rss");
            } else {
                feedsSet.add(cleanedURL + ".rss");
            }
        }
        // Rule: YouTube Channels
        else if (hostname === 'www.youtube.com' || hostname === 'youtube.com') {
            // Match /channel/UC... URLs
            const channelMatch = path.match(/^\/channel\/(UC[\w-]+)/);
            if (channelMatch && channelMatch[1]) {
                feedsSet.add(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelMatch[1]}`);
            }
            // Match /user/USERNAME URLs
            const userMatch = path.match(/^\/user\/([\w-]+)/);
            if (userMatch && userMatch[1]) {
                 feedsSet.add(`https://www.youtube.com/feeds/videos.xml?user=${userMatch[1]}`);
            }
             // Match Playlist URLs
            try {
                const originalUrlObject = new URL(fullURL);
                const playlistId = originalUrlObject.searchParams.get('list');
                if (playlistId && playlistId.startsWith('PL')) {
                    feedsSet.add(`https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`);
                }
            } catch (e) {}
        }
        // Rule: GitHub Repositories (Commits & Releases)
        else if (hostname === 'github.com') {
            // Matches /username/reponame (won't match subpages like /issues, /pulls)
            const repoMatch = path.match(/^\/([\w.-]+)\/([\w.-]+)$/);
            if (repoMatch) {
                feedsSet.add(`${cleanedURL}/commits.atom`); // Commits feed
                feedsSet.add(`${cleanedURL}/releases.atom`); // Releases feed
                feedsSet.add(`${cleanedURL}/tags.atom`); // Tags feed
            }
        }
        // Rule: Stack Exchange Sites
        else if (hostname.endsWith('stackexchange.com') || ['stackoverflow.com', 'serverfault.com', 'superuser.com', 'askubuntu.com', 'stackapps.com'].includes(hostname)) {
            if (!origin) {
                console.warn(`Skipping Stack Exchange rules for because origin could not be determined.`);
                return;
            }
            
            // Rule for Tag pages: /questions/tagged/tag-name
            const tagMatch = path.match(/^\/questions\/tagged\/([\w.+-]+)/);
            if (tagMatch && tagMatch[1]) {
                feedsSet.add(`${origin}/feeds/tag/${tagMatch[1]}`);
            }

            // Rule for specific questions: /questions/QUESTION_ID/...
            const questionMatch = path.match(/^\/questions\/(\d+)/); // Matches /questions/ followed by digits
            if (questionMatch && questionMatch[1]) {
                const questionId = questionMatch[1];
                feedsSet.add(`${origin}/feeds/question/${questionId}`); // Gets updates/answers for this question
            }

            // Rule for user profiles: /users/USER_ID/...
            const userMatch = path.match(/^\/users\/(\d+)/); // Matches /users/ followed by digits
            if (userMatch && userMatch[1]) {
                const userId = userMatch[1];
                feedsSet.add(`${origin}/feeds/user/${userId}`); // Gets activity (questions/answers) for this user
            }
        }
    } catch (error) {
        console.error(`Error in parseURLforRules for URL ${error}`);
    }
}
