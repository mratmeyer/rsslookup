import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * Rule for discovering RSS feeds on Stack Exchange network sites.
 * Handles SO, SF, SU, Ask Ubuntu, and all *.stackexchange.com sites.
 */
export class StackExchangeRule implements SiteRule {
    readonly name = "Stack Exchange";

    /** Major Stack Exchange sites with their own domains */
    private readonly majorSites = [
        "stackoverflow.com",
        "serverfault.com",
        "superuser.com",
        "askubuntu.com",
        "stackapps.com",
    ];

    matchesHostname(hostname: string): boolean {
        return (
            hostname.endsWith("stackexchange.com") ||
            this.majorSites.includes(hostname)
        );
    }

    extractFeeds(context: RuleContext, feedsMap: FeedsMap): void {
        const { hostname, pathname, origin } = context;

        if (!origin) return;

        const siteName = this.getSiteName(hostname);

        this.extractTagFeed(pathname, origin, siteName, feedsMap);
        this.extractQuestionFeed(pathname, origin, siteName, feedsMap);
        this.extractUserFeed(pathname, origin, siteName, feedsMap);
    }

    /**
     * Get a readable site name from hostname
     */
    private getSiteName(hostname: string): string {
        return hostname.replace(".com", "").replace("www.", "");
    }

    /**
     * Extract feed for tag pages: /questions/tagged/tag-name
     */
    private extractTagFeed(
        pathname: string,
        origin: string,
        siteName: string,
        feedsMap: FeedsMap
    ): void {
        const tagMatch = pathname.match(/^\/questions\/tagged\/([\w.+-]+)/);
        if (tagMatch?.[1]) {
            feedsMap.set(
                `${origin}/feeds/tag/${tagMatch[1]}`,
                { title: `${siteName} - [${tagMatch[1]}] Questions`, isFromRule: true }
            );
        }
    }

    /**
     * Extract feed for specific questions: /questions/QUESTION_ID/...
     */
    private extractQuestionFeed(
        pathname: string,
        origin: string,
        siteName: string,
        feedsMap: FeedsMap
    ): void {
        const questionMatch = pathname.match(/^\/questions\/(\d+)/);
        if (questionMatch?.[1]) {
            const questionId = questionMatch[1];
            feedsMap.set(
                `${origin}/feeds/question/${questionId}`,
                { title: `${siteName} - Question #${questionId}`, isFromRule: true }
            );
        }
    }

    /**
     * Extract feed for user profiles: /users/USER_ID/...
     */
    private extractUserFeed(
        pathname: string,
        origin: string,
        siteName: string,
        feedsMap: FeedsMap
    ): void {
        const userMatch = pathname.match(/^\/users\/(\d+)/);
        if (userMatch?.[1]) {
            const userId = userMatch[1];
            feedsMap.set(
                `${origin}/feeds/user/${userId}`,
                { title: `${siteName} - User Activity`, isFromRule: true }
            );
        }
    }
}
