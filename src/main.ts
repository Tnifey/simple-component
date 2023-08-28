import './style.css';
import { createComponent, html } from './component';

const Child = createComponent({
  setup: () => ({ count: 0 }),
  render: (state: any, { ref, add, sub }) => html`
    <button @click=${add} @contextmenu=${sub} ${ref}>
      This is child: ${state.count}
    </button>
  `,
  add(e: any) {
    e.preventDefault();
    Child.state.count += 1;
  },
  sub(e: any) {
    e.preventDefault();
    Child.state.count -= 1;
  },
});

const Parent = createComponent({
  root: document.querySelector('#app-1')!,
  render: () => html`
    <div>
      <div>This is parent (but state from Child): ${Child.state.count}</div>
      ${Child.template()}
    </div>
  `,
});
