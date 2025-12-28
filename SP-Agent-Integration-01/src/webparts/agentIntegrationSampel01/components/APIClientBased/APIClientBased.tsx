import { useCallback, useEffect, useMemo, useState } from "react";
import { IAPIClientBasedProps } from "./IAPIClientBasedProps";
import { AgentTools } from "../../../../common/AgentTools";
import { CHAT_CONSTANTS, ERROR_MESSAGES, KEYBOARD_EVENTS, MESSAGE_SENDERS } from "../../../../common/constants";
import { ConnectionSettings, CopilotStudioClient } from "@microsoft/agents-copilotstudio-client";
import { Activity } from "@microsoft/agents-activity";
import { ParsedResponse, ReferenceParser } from "../../../../common/ReferenceParser";
import { IUnifiedAuthSettings, unifiedAuthManager } from "../../../../common/UnifiedAuthManager";
import React from "react";

interface CopilotMessage {
    type: string;
    text?: string;
}

const APIClientBased: React.FC<IAPIClientBasedProps> = (props) => {
    const {
        userEmail,
        environmentId,
        agentIdentifier,
        tenantId,
        appClientId,
    } = props;

    const [messages, setMessages] = useState<Array<{
        sender: string;
        text: string;
        timestamp: Date;
        parsedResponse?: ParsedResponse;
    }>>([]);

    const connectionSettings = useMemo(() => AgentTools.getConnectionSettings(props), [environmentId, agentIdentifier, tenantId, appClientId]);

    const [input, setInput] = useState<string>('');

    const [isTyping, setIsTyping] = useState<boolean>(false);

    const [isAsking, setIsAsking] = useState<boolean>(false);

    useEffect(() => {
        if (userEmail) {
            initCopilotClient().catch(console.error);
        }
        // Only run when config/user changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userEmail]);

    const handleSend = useCallback(async (): Promise<void> => {
        if (!input.trim() || isAsking) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: MESSAGE_SENDERS.USER, text: userMessage, timestamp: new Date() }]);
        setIsTyping(true);

        try {
            const response = await askQuestion(userMessage);
            setIsTyping(false);
            const parsedResponse = ReferenceParser.parseResponse(response);
            setMessages(prev => [...prev, {
                sender: MESSAGE_SENDERS.AGENT,
                text: response,
                timestamp: new Date(),
                parsedResponse
            }]);
        } catch (error) {
            setIsTyping(false);
            console.error('Error asking question:', error);
        }
    }, [input, isAsking]);

    const getBasicAuthSettings = (): IUnifiedAuthSettings => ({
        appClientId: connectionSettings.appClientId,
        tenantId: connectionSettings.tenantId,
        currentUserLogin: userEmail,
        redirectUri: window.location.origin
    });
    const [copilotClient, setCopilotClient] = useState<CopilotStudioClient | undefined>(undefined);
    const [conversationId, setConversationId] = useState<string>('');
    const initCopilotClient = useCallback(async (): Promise<void> => {
        // Initialize and return the Copilot client using connectionSettings    
        // Get basic Power Platform token
        console.log("initCopilotClient", connectionSettings);
        const basicAuthSettings = getBasicAuthSettings();
        const tokenResult = await unifiedAuthManager.acquireToken(basicAuthSettings);
        if (!tokenResult?.accessToken) {
            throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH_TOKEN);
        }
        const client = new CopilotStudioClient(connectionSettings, tokenResult.accessToken);
        console.log('Copilot client initialized:', client);
        setCopilotClient(client);

        /*const activity = await client.startConversationStreaming(); // new method: startConversationAsync
        console.log('Conversation started:', activity);
        setConversationId(activity.conversation?.id || '');*/

    }, [connectionSettings, userEmail]);

    const askQuestion = useCallback(async (question: string): Promise<string> => {
        //const client = initCopilotClient();
        // Use the client to ask the question and return the response text

        if (!copilotClient) {
            const errorMsg = !copilotClient
                ? ERROR_MESSAGES.COPILOT_CLIENT_NOT_INITIALIZED
                : 'Conversation not initialized';
            //setError(errorMsg);
            throw new Error(errorMsg);
        }
        // LOOK THE LNK: https://github.com/microsoft/Agents/blob/main/samples/nodejs/copilotstudio-client/src/index.ts
        // https://learn.microsoft.com/en-us/javascript/api/%40microsoft/agents-activity/activity?view=agents-sdk-js-latest
        const activity: Activity = new Activity("message");
        activity.text = question;
        for await (const replyActivity of copilotClient.sendActivityStreaming(activity)) {
            console.log('Reply activity received:', replyActivity);
        }


        /*const replies: CopilotMessage[] = await copilotClient.sendActivityStreaming(activity);
        console.log('Replies received:', replies);

        if (!replies || replies.length === 0) {
            throw new Error('No response received from Copilot Studio');
        }

        let responseText = '';
        replies.forEach((act: CopilotMessage) => {
            if (act.type === CHAT_CONSTANTS.MESSAGE_TYPES.MESSAGE || act.type === CHAT_CONSTANTS.MESSAGE_TYPES.END_OF_CONVERSATION) {
                responseText += act.text || '';
            }
        });*/

        return 'No response text available';
    }, [copilotClient, conversationId]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === KEYBOARD_EVENTS.ENTER && !e.shiftKey) {
            e.preventDefault();
            handleSend().catch(console.error);
        }
    }, [handleSend]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        setInput(e.target.value);
    }, []);

    return (<>
        <div>
            {messages.length === 0 ? (
                <div>
                    <h2>Copilot Agent UI</h2>
                    <p>Agent intro</p>
                </div>) : (messages.map((msg, index) => (
                    <div key={index}>
                        <div>{msg.text}</div>
                    </div>
                )))}
        </div>
        <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Please enter your question..."
            disabled={isAsking}
            maxLength={100}
        />
    </>);
};


export default APIClientBased;
