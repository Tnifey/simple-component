import './style.css';
import { createComponent, html } from './component';

const Child = createComponent({
  render: (state: any, $) => html`
    <button @click=${$.add} @contextmenu=${$.sub} ${$.ref}>
      This is child: ${state.count}
      ${state.kek}
    </button>
  `,
  setup: () => ({ count: 0 }),
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
      ${Child({ kek: 'world' })}
    </div>
  `,
});
