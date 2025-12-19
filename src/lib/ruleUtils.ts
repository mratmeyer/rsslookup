import { cleanURL } from "./urlUtils";
import type { FeedsMap } from "./types";

/**
 * Parses URL for hardcoded rules to find potential feed URLs.
 * @param fullURL - The full URL path.
 * @param hostname - The site hostname.
 * @param feedsMap - Map of feed URL -> title (null if title should be fetched).
 */
export function parseURLforRules(
  fullURL: string,
  hostname: string,
  feedsMap: FeedsMap
): void {
  try {
    const cleanedURL = cleanURL(fullURL);
    if (!cleanedURL) return;

    let urlObject: URL;
    let path = "";
    let origin = "";
    try {
      urlObject = new URL(cleanedURL);
      path = urlObject.pathname;
      origin = urlObject.origin;
    } catch {
      // Invalid URL - return early since we can't parse rules without a valid URL
      return;
    }

    // Rule: Reddit
    if (hostname === "www.reddit.com" || hostname === "reddit.com") {
      if (path == "/") {
        // If root domain, add the trailing slash
        feedsMap.set(cleanedURL + "/.rss", "Reddit RSS Feed");
      } else {
        // Extract subreddit or path name for title
        const subredditMatch = path.match(/^\/r\/([\w]+)/);
        const title = subredditMatch
          ? `r/${subredditMatch[1]} RSS Feed`
          : "Reddit RSS Feed";
        feedsMap.set(cleanedURL + ".rss", title);
      }
    }
    // Rule: YouTube Channels
    else if (hostname === "www.youtube.com" || hostname === "youtube.com") {
      // Match /channel/UC... URLs
      const channelMatch = path.match(/^\/channel\/(UC[\w-]+)/);
      if (channelMatch && channelMatch[1]) {
        feedsMap.set(
          `https://www.youtube.com/feeds/videos.xml?channel_id=${channelMatch[1]}`,
          "YouTube Channel Feed"
        );
      }
      // Match /user/USERNAME URLs
      const userMatch = path.match(/^\/user\/([\w-]+)/);
      if (userMatch && userMatch[1]) {
        feedsMap.set(
          `https://www.youtube.com/feeds/videos.xml?user=${userMatch[1]}`,
          `YouTube - ${userMatch[1]}`
        );
      }
      // Match Playlist URLs
      try {
        const originalUrlObject = new URL(fullURL);
        const playlistId = originalUrlObject.searchParams.get("list");
        if (playlistId && playlistId.startsWith("PL")) {
          feedsMap.set(
            `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
            "YouTube Playlist Feed"
          );
        }
      } catch {
        // Silently ignore invalid URLs - playlist extraction is optional
      }
      
      // Feeds for hidden playlist URLs (certain prefixes followed by a channel's id yields a playlist_id)
      // Reference: https://wiki.archiveteam.org/index.php/YouTube/Technical_details
      for (const entry of feedsMap){
          const url = entry[0];
          // title is null, I think because it is queried AFTER all feeds are found
          const title = entry[1];
        try {
            const feedUrlObject = new URL(url);
            const channelIdDirty = feedUrlObject.searchParams.get('channel_id');
            if (!channelIdDirty || !channelIdDirty.startsWith('UC'))continue; 
            const channelId = channelIdDirty.substring(2);
            const custom_playlists = { // Reference: https://stackoverflow.com/questions/71192605/how-do-i-get-youtube-shorts-from-youtube-api-data-v3/76602819#76602819
                'UULF': "Videos", // Videos
                'UULV': "Live Streams", // Live Streams
                'UUSH': "Shorts" // Shorts
            };
            for (const [prefix, name] of Object.entries(custom_playlists)) {
                feedsMap.set(
                    `https://www.youtube.com/feeds/videos.xml?playlist_id=${prefix}${channelId}`,
                    name
                )
            }
        } catch (e) {}
      }
    }
    // Rule: GitHub Repositories (Commits & Releases)
    else if (hostname === "github.com") {
      // Matches /username/reponame (won't match subpages like /issues, /pulls)
      const repoMatch = path.match(/^\/([\w.-]+)\/([\w.-]+)$/);
      if (repoMatch) {
        const repoName = `${repoMatch[1]}/${repoMatch[2]}`;
        feedsMap.set(`${cleanedURL}/commits.atom`, `${repoName} - Commits`);
        feedsMap.set(`${cleanedURL}/releases.atom`, `${repoName} - Releases`);
        feedsMap.set(`${cleanedURL}/tags.atom`, `${repoName} - Tags`);
      }
    }
    // Rule: Stack Exchange Sites
    else if (
      hostname.endsWith("stackexchange.com") ||
      [
        "stackoverflow.com",
        "serverfault.com",
        "superuser.com",
        "askubuntu.com",
        "stackapps.com",
      ].includes(hostname)
    ) {
      if (!origin) {
        // Skip Stack Exchange rules if origin could not be determined
        return;
      }

      // Get site name from hostname
      const siteName = hostname.replace(".com", "").replace("www.", "");

      // Rule for Tag pages: /questions/tagged/tag-name
      const tagMatch = path.match(/^\/questions\/tagged\/([\w.+-]+)/);
      if (tagMatch && tagMatch[1]) {
        feedsMap.set(
          `${origin}/feeds/tag/${tagMatch[1]}`,
          `${siteName} - [${tagMatch[1]}] Questions`
        );
      }

      // Rule for specific questions: /questions/QUESTION_ID/...
      const questionMatch = path.match(/^\/questions\/(\d+)/);
      if (questionMatch && questionMatch[1]) {
        const questionId = questionMatch[1];
        feedsMap.set(
          `${origin}/feeds/question/${questionId}`,
          `${siteName} - Question #${questionId}`
        );
      }

      // Rule for user profiles: /users/USER_ID/...
      const userMatch = path.match(/^\/users\/(\d+)/);
      if (userMatch && userMatch[1]) {
        const userId = userMatch[1];
        feedsMap.set(
          `${origin}/feeds/user/${userId}`,
          `${siteName} - User Activity`
        );
      }
    }
  } catch {
    // Silently ignore errors in rule parsing - individual rules failing should not break the lookup
  }
}
