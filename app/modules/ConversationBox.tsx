'use client'
import React, { useEffect, useState, useRef } from 'react'
import { IHistory, Roles, IChatMessage, UserMessage, AssistantMessage } from '../shared/interface'
import _ from 'lodash'
import ChatUserMessage from './ChatUserMessage'
import ChatAssistantMessage from './ChatAssistantMessage'

const ConversationBox = ({
    history,
    waiting = false,
    isFetching,
}: {
    history: IHistory
    waiting: boolean
    isFetching: boolean
}) => {
    const conversationBoxRef = useRef<HTMLDivElement>(null)

    return (
        <div className="w-full mt-16 text-sm pb-9 conversation_box" ref={conversationBoxRef}>
            <div className="flex flex-col gap-2 overflow-hidden overflow-y-scroll">
                {_.map(history, (chatMessage: IChatMessage, index) => {
                    const { role } = chatMessage || {}
                    if (role == Roles.user) {
                        return <ChatUserMessage key={index} chatMessage={chatMessage as UserMessage} />
                    }
                    return (
                        <ChatAssistantMessage
                            key={index}
                            chatMessage={chatMessage as AssistantMessage}
                            waiting={waiting}
                        />
                    )
                })}
                {waiting ? <ChatAssistantMessage waiting={waiting} /> : null}
            </div>
        </div>
    )
}

export default ConversationBox
