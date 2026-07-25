import { Priority } from './priority.types';

/**
 * Get the next value of priority for toggling
 * @param previous Previous value of preority before toggling
 * @returns Next priority value after toggle
 */
export function getToggledPriority(previous: Priority): Priority {
    return previous === 'high' ? undefined : 'high';
}
