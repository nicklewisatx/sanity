import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";
import { createElement } from "react";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    themes: {
      themes: [
        {
          id: "light",
          title: "Light",
          class: "light",
          color: "#ffffff",
          default: true,
        },
        {
          id: "dark",
          title: "Dark",
          class: "dark",
          color: "#000000",
        },
      ],
    },
    darkMode: {
      classTarget: "html",
      darkClass: "dark",
      lightClass: "light",
    },
    docs: {
      theme: themes.normal,
    },
    layout: "centered",
  },
  decorators: [
    (Story) => createElement('div', { className: 'font-sans antialiased' }, createElement(Story)),
  ],
};

export default preview;