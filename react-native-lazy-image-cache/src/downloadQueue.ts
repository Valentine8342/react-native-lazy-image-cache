import { cacheImage } from './imageCache';

interface QueueItem {
    uri: string;
    resolve: (value: string) => void;
    reject: (reason?: any) => void;
  }
  
  class DownloadQueue {
    private queue: QueueItem[] = [];
    private concurrentDownloads = 2;
    private activeDownloads = 0;
  
    enqueue(uri: string): Promise<string> {
      return new Promise((resolve, reject) => {
        this.queue.push({ uri, resolve, reject });
        this.processQueue();
      });
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