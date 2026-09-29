type Listener = (data: any) => void;

class RealtimeHub {
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  broadcast(event: string, payload: any) {
    const message = { event, payload, timestamp: new Date().toISOString() };
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (err) {
        console.error("Error dispatching event:", err);
      }
    });
  }
}

const globalForHub = global as unknown as { realtimeHub: RealtimeHub };
export const realtimeHub = globalForHub.realtimeHub || new RealtimeHub();
if (process.env.NODE_ENV !== "production") globalForHub.realtimeHub = realtimeHub;
