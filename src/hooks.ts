export function useState<T = any>(initial: T) {
    const observers = new Set<Function>();
    let value: T = initial;

    function setValue(update: T | ((value: T) => T)) {
        value = (typeof update === 'function' ? (update as Function)(value) : update) as T;
        trigger();
        return value;
    }

    function trigger() {
        observers.forEach(fn => fn(value));
    }

    function observe(fn: (value: T) => void, options?: {
        immediate?: boolean;
    }) {
        // Immediate triggers the observer immediately with the current value
        if (options?.immediate) fn(value);
        observers.add(fn);
        return () => observers.delete(fn);
    }

    return [setValue, observe, trigger] as const;
}

