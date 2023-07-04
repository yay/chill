export type ChillElement = {
  type: string;
  props: {
    children: ChillElement[];
  };
};

// TODO: transform JSX to function calls: https://esbuild.github.io/api/#jsx

const textElementType = '#text';

export type ChillTextElement = ChillElement & {
  type: typeof textElementType;
  props: {
    nodeValue: Text['nodeValue'];
  };
};

export const Chill = {
  createElement: (type: string, props?: object, ...children: any[]): ChillElement => {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => (typeof child === 'object' ? child : Chill.createTextElement(child))),
      },
    };
  },

  createTextElement: (text: string): ChillTextElement => {
    return {
      type: textElementType,
      props: {
        nodeValue: text,
        children: [],
      },
    };
  },

  render: (element: ChillElement, container: HTMLElement | Text) => {
    const dom = element.type === textElementType ? document.createTextNode('') : document.createElement(element.type);
    const isProperty = (key) => key !== 'children';
    const { props } = element;
    Object.keys(props)
      .filter(isProperty)
      .forEach((name) => {
        dom[name] = props[name];
      });
    props.children.forEach((child) => Chill.render(child, dom));
    container.appendChild(dom);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const element = Chill.createElement(
    'div',
    { className: 'hey' },
    'Hello',
    Chill.createElement('p', undefined, 'World')
  );
  console.log(JSON.stringify(element, null, 4));

  const container = document.createElement('div');
  document.body.appendChild(container);
  Chill.render(element, container);
});
