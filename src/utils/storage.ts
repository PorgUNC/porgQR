import { Poll } from '../types';

const STORAGE_KEY = 'porgqr_polls';

export function loadPolls(): Poll[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading polls:', error);
    return [];
  }
}

export function savePolls(polls: Poll[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
  } catch (error) {
    console.error('Error saving polls:', error);
  }
}
