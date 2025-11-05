// Type definitions for SlotSwapper
// Note: In JSX we don't use TypeScript, but we keep these as reference

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} avatar
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {Date} startTime
 * @property {Date} endTime
 * @property {string} status - 'available' | 'swap-pending' | 'confirmed'
 * @property {boolean} isSwappable
 * @property {string} ownerId
 */

/**
 * @typedef {Object} SwapRequest
 * @property {string} id
 * @property {string} requestedSlotId
 * @property {string} offeredSlotId
 * @property {string} requesterId
 * @property {string} requestedOwnerId
 * @property {string} status - 'pending' | 'accepted' | 'rejected' | 'cancelled'
 * @property {Date} createdAt
 */

export {}
