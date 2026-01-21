import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * Rule for discovering RSS feeds on Steam.
 * Handles store.steampowered.com URLs.
 */
export class SteamRule implements SiteRule {
    readonly name = "Steam";

    private readonly validHostnames = ["store.steampowered.com"];

    matchesHostname(hostname: string): boolean {
        return this.validHostnames.includes(hostname);
    }

    extractFeeds(context: RuleContext, feedsMap: FeedsMap): void {
        const { fullURL, pathname, searchParams } = context;

        this.extractUpdatesFeed(pathname, feedsMap);
    }

    /**
     * Extract feed from /news/app/{app_id}/ URLs
     */
    private extractUpdatesFeed(pathname: string, feedsMap: FeedsMap): void {
        // Matches /app/{app_id}/ and /news/app/{app_id}
        const appIdMatch = pathname.match(/^\/(news\/)?app\/(\d+)(\/|$)/)
        if (appIdMatch) {
            const appId = appIdMatch[2];
            const gameNameMatch = pathname.match(/^\/(news\/)?app\/(\d+)\/([a-zA-Z0-9\_\-]+)(\/|$)/);
            let feedName = "Game Updates";
            if (gameNameMatch){ 
                let gameName = gameNameMatch[3];
                let gameNameClean = gameName.replaceAll('_', ' ');
                feedName = gameNameClean+" Updates";
            }
            feedsMap.set(
                `https://store.steampowered.com/feeds/news/app/${appId}/`,
                {title: feedName, isFromRule: true}
            )
        }
    }
}
