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
    render: (state: State, context: Context) => TemplateResult;
    setup?: () => State;
    [key: string]: any;
};

export function createComponent<T = Record<string, any>>(options: ComponentOptions<T>) {
    const { root, render: template, setup = () => ({}), ...rest } = options;
    const scope = effectScope();
    const state = reactive(setup() as object);
    const ref = createRef();

    function $template() {
        const context = { ref: $ref(ref) as any, self: ref.value, ...rest } as const;
        return template(state as unknown as T, context);
    }

    function render(root?: HTMLElement | DocumentFragment) {
        if (!root) return;
        $render($template(), root as DocumentFragment);
    }

    effect(() => render(root as any), { lazy: true, scope })();

    const component = [state as T, ref] as const;
    (component as Record<string, any>).state = state;
    (component as Record<string, any>).ref = ref;
    (component as Record<string, any>).template = $template;

    return component as [T, ReturnType<typeof $ref>] & {
        state: T;
        ref: ReturnType<typeof $ref>;
        template: () => TemplateResult;
    };
}
