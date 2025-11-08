// A simple event emitter
// See https://dev.to/raresportan/how-to-build-a-type-safe-event-emitter-in-typescript-192b

type Listener = (...args: any[]) => void;

class EventEmitter {
  private listeners: { [event: string]: Listener[] } = {};

  on(event: string, listener: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: string, listener: Listener) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach(listener => listener(...args));
  }
}

// Global error emitter
export const errorEmitter = new EventEmitter();
