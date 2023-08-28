import { reactive, effect, effectScope } from '@vue/reactivity';
import { render as $render, TemplateResult } from 'lit-html';
import { createRef, ref as $ref } from 'lit-html/directives/ref.js';

export { html } from 'lit-html';
export { reactive, computed, ref } from '@vue/reactivity';

export type Context<C> = {
    ref: ReturnType<typeof $ref>;
    self: HTMLElement | Element | null;
} & C;

export type ComponentOptions<S, C> = {
    root?: Element | HTMLElement | DocumentFragment;
    setup?: () => S;
    render: (state: S, $: Context<C>) => TemplateResult;
} & C;

export function component<S, C = Record<string, any>>(options: ComponentOptions<S, C>) {
    const { root, render: template, setup = () => ({}), ...rest } = options;
    const scope = effectScope(false);
    const state = reactive(setup() as object);
    const ref = createRef();

    function $context() {
        return { ref: $ref(ref) as any, self: ref.value, ...rest } as const as Context<C>;
    }

    function $template(additionalState = {}) {
        return template({ ...state, ...additionalState } as const as S, $context());
    }

    function render(root?: HTMLElement | DocumentFragment) {
        if (!root) return;
        $render($template(), root as DocumentFragment);
    }

    const subscribe = effect(() => render(root as any), {
        lazy: true,
        scope,
    });

    subscribe();

    return Object.assign($template, [state as S, ref] as const, {
        render,
        scope,
        get state() {
            return state as S;
        },
        get ref() {
            return ref.value;
        },
        get template() {
            return $template();
        },
    });
}

// export function createComponent<S, C = Record<string, any>>(options: ComponentOptions<S, C>) {
//     return () => component(options);
// }
