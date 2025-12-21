import fs from 'fs/promises';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'tattty-logs.json');

export interface LogEntry {
  id: string;
  timestamp: string;
  requestId: string;
  type: 'info' | 'success' | 'error' | 'prompt' | 'image';
  source: 'Baddie' | 'Replicate' | 'System';
  message: string;
  details?: any;
}

export async function writeLog(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
  try {
    let logs: LogEntry[] = [];
    try {
      const data = await fs.readFile(LOG_FILE, 'utf-8');
      logs = JSON.parse(data);
    } catch (e) {
      // File doesn't exist or is empty, start fresh
    }

    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      ...entry
    };

    // Keep last 100 logs
    logs = [newEntry, ...logs].slice(0, 100);

    await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
    return newEntry;
  } catch (error) {
    console.error("Failed to write log:", error);
  }
}

export async function getLogs(): Promise<LogEntry[]> {
  try {
    const data = await fs.readFile(LOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function clearLogs() {
    try {
        await fs.writeFile(LOG_FILE, JSON.stringify([], null, 2));
        return { success: true };
    } catch (e) {
        return { success: false, error: e };
    }
}
