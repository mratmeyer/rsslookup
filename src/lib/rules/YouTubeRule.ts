import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * Rule for discovering RSS feeds on YouTube.
 * Handles channels, users, playlists, and derives additional playlist feeds.
 */
export class YouTubeRule implements SiteRule {
    readonly name = "YouTube";

    private readonly validHostnames = ["www.youtube.com", "youtube.com"];

    /** Playlist prefixes for different content types */
    private readonly playlistPrefixes: Record<string, string> = {
        UULF: "Videos",
        UULV: "Live Streams",
        UUSH: "Shorts",
    };

    matchesHostname(hostname: string): boolean {
        return this.validHostnames.includes(hostname);
    }

    extractFeeds(context: RuleContext, feedsMap: FeedsMap): void {
        const { fullURL, pathname, searchParams } = context;

        this.extractChannelFeed(pathname, feedsMap);
        this.extractUserFeed(pathname, feedsMap);
        this.extractPlaylistFeed(fullURL, feedsMap);
        this.extractDerivedPlaylistFeeds(feedsMap);
    }

    /**
     * Extract feed from /channel/UC... URLs
     */
    private extractChannelFeed(pathname: string, feedsMap: FeedsMap): void {
        const channelMatch = pathname.match(/^\/channel\/(UC[\w-]+)/);
        if (channelMatch?.[1]) {
            feedsMap.set(
                `https://www.youtube.com/feeds/videos.xml?channel_id=${channelMatch[1]}`,
                { title: "YouTube Channel Feed", isFromRule: true }
            );
        }
    }

    /**
     * Extract feed from /user/USERNAME URLs
     */
    private extractUserFeed(pathname: string, feedsMap: FeedsMap): void {
        const userMatch = pathname.match(/^\/user\/([\w-]+)/);
        if (userMatch?.[1]) {
            feedsMap.set(
                `https://www.youtube.com/feeds/videos.xml?user=${userMatch[1]}`,
                { title: `YouTube - ${userMatch[1]}`, isFromRule: true }
            );
        }
    }

    /**
     * Extract feed from playlist URLs (?list=PL...)
     */
    private extractPlaylistFeed(fullURL: string, feedsMap: FeedsMap): void {
        try {
            const urlObject = new URL(fullURL);
            const playlistId = urlObject.searchParams.get("list");
            if (playlistId?.startsWith("PL")) {
                feedsMap.set(
                    `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
                    { title: "YouTube Playlist Feed", isFromRule: true }
                );
            }
        } catch {
            // Invalid URL - playlist extraction is optional
        }
    }

    /**
     * Derive additional playlist feeds (Videos, Live Streams, Shorts) from existing channel feeds.
     * Reference: https://wiki.archiveteam.org/index.php/YouTube/Technical_details
     */
    private extractDerivedPlaylistFeeds(feedsMap: FeedsMap): void {
        // Iterate over a copy of entries since we're modifying the map
        const existingEntries = Array.from(feedsMap.entries());

        for (const [url] of existingEntries) {
            try {
                const feedUrlObject = new URL(url);
                const channelIdFull = feedUrlObject.searchParams.get("channel_id");

                if (!channelIdFull?.startsWith("UC")) continue;

                // Remove "UC" prefix to get base channel ID
                const channelIdBase = channelIdFull.substring(2);

                // Add feeds for each playlist type
                for (const [prefix, name] of Object.entries(this.playlistPrefixes)) {
                    feedsMap.set(
                        `https://www.youtube.com/feeds/videos.xml?playlist_id=${prefix}${channelIdBase}`,
                        { title: name, isFromRule: true }
                    );
                }
            } catch {
                // Invalid URL - skip this entry
            }
        }
    }
}
