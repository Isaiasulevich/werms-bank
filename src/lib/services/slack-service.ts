/**
 * Lightweight Slack Web API helper.
 *
 * Exposes a singleton factory `slackService()` that returns a single
 * instance of `SlackService` configured with the bot token from
 * `process.env.SLACK_BOT_USER_OAUTH_TOKEN`.
 */
let slack: SlackService | null = null
/**
 * Returns a shared instance of `SlackService`.
 * - Lazily instantiates the service the first time it is called.
 * - Requires `SLACK_BOT_USER_OAUTH_TOKEN` to be present in the environment.
 */
export const slackService = () => {
    if (slack == null) {
        if (!process.env.SLACK_BOT_USER_OAUTH_TOKEN) {
            // TODO: Consider throwing a real Error instead of logging to console
            // so callers can handle initialization failures deterministically.
            throw console.error("Slack Auth Token not configured")
        }
        slack = new SlackService(process.env.SLACK_BOT_USER_OAUTH_TOKEN)
    }
    return slack
}

/**
 * Thin wrapper around Slack's Web API for a few commonly used operations.
 */
class SlackService {
    private baseUrl = `https://slack.com/api`
    private auth: string

    constructor(authToken: string) {
        this.auth = authToken
    }

    /**
     * Authorization header for Slack Web API requests.
     */
    private get authHeader() {
        return { 'Authorization': `Bearer ${this.auth}` }
    }

    /**
     * Fetches a Slack user's email address using the `users.info` endpoint.
     *
     * @param userId Slack user ID (e.g., `U0123ABC`)
     * @returns The user's email address.
     * @throws Error if the HTTP response is not OK or the email is missing.
     */
    async getUserEmail(userId: string): Promise<string> {
        const apiUrl = `${this.baseUrl}/users.info?user=${userId}`
        const response = await fetch(apiUrl, {  
            headers: this.authHeader
        })
        const data = await response.json()
        
        if (!response.ok) {
            throw new Error("Something")
        }
        if (!data.user?.profile?.email) {
            throw new Error("Email not found")
        }

        return data.user.profile.email
    }

    /**
     * Helper to produce a simple Slack-compatible text response payload.
     * Useful for slash-command or interactivity response bodies.
     *
     * @param text Message text to display.
     * @param response_type Slack visibility: `in_channel` (public) or `ephemeral` (only requester).
     * @returns Minimal Slack response object with `text` and optional `response_type`.
     */
    public returnResponse(
        text: string,
        response_type?: 'in_channel' | 'ephemeral'
    ): { response_type: 'in_channel' | 'ephemeral' | undefined; text: string } {
        return { response_type, text }
    }
}