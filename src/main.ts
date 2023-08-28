import './style.css';
import { component, html } from './component';

const Child = () => {
  const self = component({
    render: (state: any, $) => html`
      <button @click=${$.add} @contextmenu=${$.sub} ${$.ref}>
        ${state.text ? state.text : `This is child #${state.number}`}: ${state.count}
      </button>
    `,
    setup: () => ({ count: 0 }),
    add(e: any) {
      e.preventDefault();
      self.state.count += 1;
    },
    sub(e: any) {
      e.preventDefault();
      self.state.count -= 1;
    },
  });
  return self;
};

component({
  root: document.querySelector('#app-1')!,
  setup: () => {
    const rt: Record<string, any> = {
      Child: Child(),
      Child3: Child(),
    };
    rt['Child2'] = rt.Child;
    return rt;
  },
  render: (state) => html`
    <div>
      <div>This is parent (but state from Child): ${state.Child.state.count}</div>
      ${state.Child({ number: 1 })}
      ${state.Child2({ number: 3, text: 'Is connected to #1' })}
      ${state.Child3({ number: 2, text: 'Independent' })}
    </div>
  `,
});
