import { reactive, effect, effectScope } from '@vue/reactivity';
import { render as $render, TemplateResult } from 'lit-html';
import { createRef, ref as $ref } from 'lit-html/directives/ref.js';

export { html } from 'lit-html';
export { reactive, computed, ref } from '@vue/reactivity';

export type Context = {
    ref: ReturnType<typeof $ref>;
    self: any;
    [key: string]: any;
};

export type ComponentOptions<State> = {
    root?: Element | HTMLElement | DocumentFragment;
    setup?: () => State;
    render: (state: State, $: Context) => TemplateResult;
    [key: string]: any;
};

export function createComponent<T = Record<string, any>>(options: ComponentOptions<T>) {
    const { root, render: template, setup = () => ({}), ...rest } = options;
    const scope = effectScope();
    const state = reactive(setup() as object);
    const ref = createRef();

    function $context() {
        return { ref: $ref(ref) as any, self: ref.value, ...rest } as const as Context;
    }

    function $template(additionalState = {}) {
        return template({ ...state, ...additionalState } as const as T, $context());
    }

    function render(root?: HTMLElement | DocumentFragment) {
        if (!root) return;
        $render($template(), root as DocumentFragment);
    }

    effect(() => render(root as any), { lazy: true, scope })();

    return Object.assign($template, [state as T, ref] as const, {
        render,
        scope,
        get state() {
            return state as T;
        },
        get ref() {
            return ref.value;
        },
        get template() {
            return $template();
        },
    });
}
