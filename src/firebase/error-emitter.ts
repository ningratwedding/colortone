// A simple event emitter
// See https://dev.to/raresportan/how-to-build-a-type-safe-event-emitter-in-typescript-192b

type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: Listener<T>[] = [];

  on(listener: Listener<T>) {
    this.listeners.push(listener);
  }

  off(listener: Listener<T>) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  emit(data: T) {
    this.listeners.forEach(listener => listener(data));
  }
}

// Global error emitter
export const errorEmitter = new EventEmitter<any>();
