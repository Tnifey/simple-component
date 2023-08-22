import { html } from 'lit-html';
import './style.css';
import { component } from './component';

function Butt(props: any) {
  const template = (props: any) => html`
    <button class="btn" @click=${props.countUp}>${props.count}</button>
  `;

  return component(template, props, (props, update) => ({
    count: props()?.count ?? 0,
    countUp() {
      update((props: any) => ({
        ...props,
        count: props.count + 1,
      }));
    },
  }));
}

Butt({ hello: "world" }).render("#app");