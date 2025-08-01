let slack: SlackService | null = null
export const slackService = () => {
    if (slack == null) {
        if (!process.env.SLACK_BOT_USER_OAUTH_TOKEN) {
            throw console.error("Slack Auth Token not configured")
        }
        slack = new SlackService(process.env.SLACK_BOT_USER_OAUTH_TOKEN)
    }
    return slack
}

class SlackService {
    private baseUrl = `https://slack.com/api`
    private auth: string

    constructor(authToken: string) {
        this.auth = authToken
    }

    private get authHeader() {
        return { 'Authorization': `Bearer ${this.auth}` }
    }

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

    public returnResponse(
        text: string,
        response_type?: 'in_channel' | 'ephemeral'
    ): { response_type: 'in_channel' | 'ephemeral' | undefined; text: string } {
        return { response_type, text }
    }
}