import { RenderOptions, TemplateResult, render as litRender } from "lit-html";

export type TemlpateFunction = (props?: any) => TemplateResult;
export type ContextFunction = (self: any, props?: any) => Record<string, any>;

export function component(template: TemlpateFunction, initial: Record<string, any> = {}, context: ContextFunction = () => ({})) {
    const [state, update, observe] = useState<any>(initial);

    return {
        state: () => state,
        update,
        observe,
        render(target: any, options?: RenderOptions) {
            const targetElement = typeof target === "string" ? document.querySelector(target)
                : typeof target === 'function' ? target({ state, update, observe }) : target;

            function render(state: any) {
                litRender(template(state), targetElement, options);
            }

            observe(render);

            update((state: any) => ({
                ...context(() => state, update),
                ...state,
            }));

            return [() => state, update];
        },
    };
}


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

    function observe(fn: (value: T) => any, options?: {
        immediate?: boolean;
    }) {
        if (options?.immediate) fn(value);
        observers.add(fn);
        return () => observers.delete(fn);
    }

    return [value, setValue, observe, trigger] as const;
}

