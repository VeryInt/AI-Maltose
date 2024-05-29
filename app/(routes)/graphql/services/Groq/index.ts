// import 'dotenv/config'
import GroqDal from '../../dal/Groq'
import _ from 'lodash'
import { Repeater } from 'graphql-yoga'

const typeDefinitions = `
    scalar JSON
    type Chat {
        Groq(params: GroqArgs): ChatResult
        GroqStream(params: GroqArgs): [String]
    }

    input GroqArgs {
        messages: Message
        "API_KEY"
        apiKey: String
        "Model Name"
        model: String
        "Max Tokens"
        maxTokens: Int
    }
`
export const Groq = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { messages: baseMessages, maxTokens: baseMaxTokens } = parent || {}
    const groqArgs = args?.params || {}
    const { messages: appendMessages, apiKey, model, maxTokens } = groqArgs || {}
    const maxTokensUse = maxTokens || baseMaxTokens
    const messages = _.concat([], baseMessages || [], appendMessages || []) || []
    const key = messages.at(-1)?.content
    console.log(`key`, key)
    if (!key) {
        return { text: '' }
    }
    const text: any = await (
        await GroqDal.loader(context, { messages, apiKey, model, maxOutputTokens: maxTokensUse }, key)
    ).load(key)
    return { text }
}

export const GroqStream = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const xvalue = new Repeater<String>(async (push, stop) => {
        const { messages: baseMessages, maxTokens: baseMaxTokens } = parent || {}
        const groqArgs = args?.params || {}
        const { messages: appendMessages, apiKey, model, maxTokens } = groqArgs || {}
        const maxTokensUse = maxTokens || baseMaxTokens
        const messages = _.concat([], baseMessages || [], appendMessages || []) || []
        const key = `${messages.at(-1)?.content || ''}_stream`

        await (
            await GroqDal.loader(
                context,
                {
                    messages,
                    apiKey,
                    model,
                    maxOutputTokens: maxTokensUse,
                    isStream: true,
                    completeHandler: ({ content, status }) => {
                        stop()
                    },
                    streamHandler: ({ token, status }) => {
                        if (token && status) {
                            push(token)
                        }
                    },
                },
                key
            )
        ).load(key)
    })
    return xvalue
}

const resolvers = {
    Chat: {
        Groq,
        GroqStream,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
