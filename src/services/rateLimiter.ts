interface DailyCounter {
  date: string; // YYYY-MM-DD format
  count: number;
}

class RateLimiter {
  private dailyCounter: DailyCounter | null = null;
  private readonly maxMessagesPerDay: number;

  constructor(maxMessagesPerDay: number = 50) {
    this.maxMessagesPerDay = maxMessagesPerDay;
  }

  private getTodayDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }

  private resetIfNewDay(): void {
    const today = this.getTodayDate();
    
    if (!this.dailyCounter || this.dailyCounter.date !== today) {
      this.dailyCounter = {
        date: today,
        count: 0,
      };
    }
  }

  canSend(): boolean {
    this.resetIfNewDay();
    return this.dailyCounter!.count < this.maxMessagesPerDay;
  }

  increment(): void {
    this.resetIfNewDay();
    if (this.dailyCounter) {
      this.dailyCounter.count++;
    }
  }

  getRemaining(): number {
    this.resetIfNewDay();
    return Math.max(0, this.maxMessagesPerDay - (this.dailyCounter?.count || 0));
  }

  getCount(): number {
    this.resetIfNewDay();
    return this.dailyCounter?.count || 0;
  }
}

// Export a singleton instance
export const smsRateLimiter = new RateLimiter(50);

