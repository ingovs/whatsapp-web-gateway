/**
 * Formats the destination into a valid JID (Jabber ID)
 * Prioritizes chat_id if provided, otherwise formats the phone_number.
 * Jabber ID (JID) is a unique identifier used by the app’s underlying protocol to route messages to the correct person or group.
 * 
 * @param {string} phone_number - Raw phone number (e.g. 5511999999999)
 * @param {string} chat_id - Direct internal ID (e.g. 5511999999999@c.us or 12345@g.us)
 * @returns {string} - Formatted JID
 */
const getJid = (phone_number, chat_id) => {
    if (chat_id) {
        return chat_id;
    }
    if (phone_number) {
        return `${phone_number}@c.us`;
    }
    throw new Error('Missing phone_number or chat_id');
};

module.exports = { getJid };
