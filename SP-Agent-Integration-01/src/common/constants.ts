export const MESSAGE_SENDERS = {
    USER: 'user',
    AGENT: 'agent',
} as const;

export const REF_PARSER_CONSTANTS = {
    REFERENCES_TITLE: 'References',
    CITATION_PATTERN: /\[(\d+)\]/g,
    LINK_PATTERN: /https?:\/\/[^\s\]]+/g,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    FAILED_TO_FETCH_TOKEN: 'Failed to fetch access token.',
    COPILOT_CLIENT_NOT_INITIALIZED: 'CopilotStudioClient not initialized.',
    UNKNOWN_ERROR: 'Unknown error',
    NO_USERS_SIGNED_IN: 'No users are signed in',
} as const;

export const KEYBOARD_EVENTS = {
    ENTER: 'Enter',
} as const;

export const CHAT_CONSTANTS = {
    MESSAGE_TYPES: {
        MESSAGE: 'message',
        END_OF_CONVERSATION: 'endOfConversation',
    },
    MAX_INPUT_LENGTH: 2000,
} as const;
