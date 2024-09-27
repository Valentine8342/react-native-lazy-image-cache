import { cacheImage } from './imageCache';

interface QueueItem {
    uri: string;
    priority: 'low' | 'normal' | 'high';
    resolve: (value: string) => void;
    reject: (reason?: any) => void;
  }
  
  class DownloadQueue {
    private queue: QueueItem[] = [];
    private concurrentDownloads = 2;
    private activeDownloads = 0;
  
    enqueue(uri: string, priority: 'low' | 'normal' | 'high' = 'normal'): Promise<string> {
      return new Promise((resolve, reject) => {
        this.queue.push({ uri, priority, resolve, reject });
        this.queue.sort((a, b) => this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority));
        this.processQueue();
      });
    }
  
    private getPriorityValue(priority: 'low' | 'normal' | 'high'): number {
      switch (priority) {
        case 'high': return 3;
        case 'normal': return 2;
        case 'low': return 1;
      }
    }
  
    private async processQueue() {
      if (this.activeDownloads >= this.concurrentDownloads || this.queue.length === 0) {
        return;
      }
  
      this.activeDownloads++;
      const { uri, resolve, reject } = this.queue.shift()!;
  
      try {
        const cachedUri = await cacheImage(uri);
        resolve(cachedUri);
      } catch (error) {
        reject(error);
      } finally {
        this.activeDownloads--;
        this.processQueue();
      }
    }
  }
  
  export const downloadQueue = new DownloadQueue();