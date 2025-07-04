import type { Meta, StoryObj } from "@storybook/react";
import { Section, Grid, Flex, Stack } from "./layout.js";

// Section Stories
const sectionMeta = {
  title: "Components/Layout/Section",
  component: Section,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A section wrapper component with consistent vertical spacing.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    spacing: {
      control: "select",
      options: ["none", "sm", "default", "lg", "xl"],
      description: "Vertical spacing preset",
    },
    as: {
      control: "text",
      description: "HTML element to render as",
    },
  },
} satisfies Meta<typeof Section>;

export default sectionMeta;
type SectionStory = StoryObj<typeof sectionMeta>;

export const DefaultSection: SectionStory = {
  args: {
    children: (
      <div className="bg-muted p-8 text-center">
        <p>Section with default spacing</p>
      </div>
    ),
  },
};

export const SectionSpacing: SectionStory = {
  render: () => (
    <div>
      <Section spacing="none" className="bg-primary/10">
        <div className="p-4 text-center">No spacing</div>
      </Section>
      <Section spacing="sm" className="bg-secondary/10">
        <div className="p-4 text-center">Small spacing</div>
      </Section>
      <Section spacing="default" className="bg-accent/10">
        <div className="p-4 text-center">Default spacing</div>
      </Section>
      <Section spacing="lg" className="bg-muted">
        <div className="p-4 text-center">Large spacing</div>
      </Section>
      <Section spacing="xl" className="bg-primary/10">
        <div className="p-4 text-center">Extra large spacing</div>
      </Section>
    </div>
  ),
};

// Grid Stories
export const GridMeta = {
  title: "Components/Layout/Grid",
  component: Grid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A responsive grid layout component with automatic breakpoints.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    cols: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6, "auto"],
      description: "Number of columns (responsive)",
    },
    gap: {
      control: "select",
      options: ["none", "sm", "default", "lg", "xl"],
      description: "Gap between items",
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
      description: "Vertical alignment of items",
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      description: "Horizontal alignment of items",
    },
  },
} satisfies Meta<typeof Grid>;

type GridStory = StoryObj<typeof GridMeta>;

export const DefaultGrid: GridStory = {
  args: {
    cols: 3,
    children: (
      <>
        <div className="bg-muted p-4 text-center">Item 1</div>
        <div className="bg-muted p-4 text-center">Item 2</div>
        <div className="bg-muted p-4 text-center">Item 3</div>
        <div className="bg-muted p-4 text-center">Item 4</div>
        <div className="bg-muted p-4 text-center">Item 5</div>
        <div className="bg-muted p-4 text-center">Item 6</div>
      </>
    ),
  },
};

export const GridColumns: GridStory = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-4 text-sm text-muted-foreground">2 Columns</p>
        <Grid cols={2}>
          <div className="bg-primary/20 p-4">Item 1</div>
          <div className="bg-primary/20 p-4">Item 2</div>
          <div className="bg-primary/20 p-4">Item 3</div>
          <div className="bg-primary/20 p-4">Item 4</div>
        </Grid>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">3 Columns</p>
        <Grid cols={3}>
          <div className="bg-secondary/20 p-4">Item 1</div>
          <div className="bg-secondary/20 p-4">Item 2</div>
          <div className="bg-secondary/20 p-4">Item 3</div>
          <div className="bg-secondary/20 p-4">Item 4</div>
          <div className="bg-secondary/20 p-4">Item 5</div>
          <div className="bg-secondary/20 p-4">Item 6</div>
        </Grid>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">4 Columns</p>
        <Grid cols={4}>
          <div className="bg-accent/20 p-4">Item 1</div>
          <div className="bg-accent/20 p-4">Item 2</div>
          <div className="bg-accent/20 p-4">Item 3</div>
          <div className="bg-accent/20 p-4">Item 4</div>
        </Grid>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Auto-fit Columns</p>
        <Grid cols="auto">
          <div className="bg-muted p-4">Auto 1</div>
          <div className="bg-muted p-4">Auto 2</div>
          <div className="bg-muted p-4">Auto 3</div>
          <div className="bg-muted p-4">Auto 4</div>
          <div className="bg-muted p-4">Auto 5</div>
        </Grid>
      </div>
    </div>
  ),
};

export const GridGaps: GridStory = {
  render: () => (
    <div className="space-y-8">
      <Grid cols={3} gap="sm">
        <div className="bg-muted p-4">Small gap</div>
        <div className="bg-muted p-4">Small gap</div>
        <div className="bg-muted p-4">Small gap</div>
      </Grid>
      <Grid cols={3} gap="default">
        <div className="bg-muted p-4">Default gap</div>
        <div className="bg-muted p-4">Default gap</div>
        <div className="bg-muted p-4">Default gap</div>
      </Grid>
      <Grid cols={3} gap="lg">
        <div className="bg-muted p-4">Large gap</div>
        <div className="bg-muted p-4">Large gap</div>
        <div className="bg-muted p-4">Large gap</div>
      </Grid>
    </div>
  ),
};

// Flex Stories
export const FlexMeta = {
  title: "Components/Layout/Flex",
  component: Flex,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible box layout component for one-dimensional layouts.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["row", "col", "rowReverse", "colReverse"],
      description: "Flex direction",
    },
    wrap: {
      control: "select",
      options: ["nowrap", "wrap", "wrapReverse"],
      description: "Flex wrap behavior",
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
      description: "Align items",
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      description: "Justify content",
    },
    gap: {
      control: "select",
      options: ["none", "sm", "default", "lg", "xl"],
      description: "Gap between items",
    },
  },
} satisfies Meta<typeof Flex>;

type FlexStory = StoryObj<typeof FlexMeta>;

export const DefaultFlex: FlexStory = {
  args: {
    children: (
      <>
        <div className="bg-muted p-4">Item 1</div>
        <div className="bg-muted p-4">Item 2</div>
        <div className="bg-muted p-4">Item 3</div>
      </>
    ),
  },
};

export const FlexDirection: FlexStory = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Row (default)</p>
        <Flex direction="row">
          <div className="bg-primary/20 p-4">1</div>
          <div className="bg-primary/20 p-4">2</div>
          <div className="bg-primary/20 p-4">3</div>
        </Flex>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Column</p>
        <Flex direction="col">
          <div className="bg-secondary/20 p-4">1</div>
          <div className="bg-secondary/20 p-4">2</div>
          <div className="bg-secondary/20 p-4">3</div>
        </Flex>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Row Reverse</p>
        <Flex direction="rowReverse">
          <div className="bg-accent/20 p-4">1</div>
          <div className="bg-accent/20 p-4">2</div>
          <div className="bg-accent/20 p-4">3</div>
        </Flex>
      </div>
    </div>
  ),
};

export const FlexAlignment: FlexStory = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          Justify: space-between
        </p>
        <Flex justify="between" className="bg-muted/50 p-4">
          <div className="bg-background p-4">Start</div>
          <div className="bg-background p-4">End</div>
        </Flex>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          Justify: center, Align: center
        </p>
        <Flex justify="center" align="center" className="bg-muted/50 p-4 h-32">
          <div className="bg-background p-4">Centered</div>
        </Flex>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          Justify: space-evenly
        </p>
        <Flex justify="evenly" className="bg-muted/50 p-4">
          <div className="bg-background p-4">1</div>
          <div className="bg-background p-4">2</div>
          <div className="bg-background p-4">3</div>
        </Flex>
      </div>
    </div>
  ),
};

// Stack Stories
export const StackMeta = {
  title: "Components/Layout/Stack",
  component: Stack,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "A vertical stack layout component with consistent spacing.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    gap: {
      control: "select",
      options: ["none", "xs", "sm", "default", "lg", "xl"],
      description: "Gap between items",
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
      description: "Horizontal alignment",
    },
  },
} satisfies Meta<typeof Stack>;

type StackStory = StoryObj<typeof StackMeta>;

export const DefaultStack: StackStory = {
  args: {
    children: (
      <>
        <div className="bg-muted p-4">Item 1</div>
        <div className="bg-muted p-4">Item 2</div>
        <div className="bg-muted p-4">Item 3</div>
      </>
    ),
  },
};

export const StackSpacing: StackStory = {
  render: () => (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Extra Small Gap</p>
        <Stack gap="xs">
          <div className="bg-muted p-2">Item 1</div>
          <div className="bg-muted p-2">Item 2</div>
          <div className="bg-muted p-2">Item 3</div>
        </Stack>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Small Gap</p>
        <Stack gap="sm">
          <div className="bg-muted p-2">Item 1</div>
          <div className="bg-muted p-2">Item 2</div>
          <div className="bg-muted p-2">Item 3</div>
        </Stack>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Default Gap</p>
        <Stack gap="default">
          <div className="bg-muted p-2">Item 1</div>
          <div className="bg-muted p-2">Item 2</div>
          <div className="bg-muted p-2">Item 3</div>
        </Stack>
      </div>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Large Gap</p>
        <Stack gap="lg">
          <div className="bg-muted p-2">Item 1</div>
          <div className="bg-muted p-2">Item 2</div>
          <div className="bg-muted p-2">Item 3</div>
        </Stack>
      </div>
    </div>
  ),
};

export const RealWorldLayoutExample: StackStory = {
  render: () => (
    <Section spacing="lg">
      <Stack gap="xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Real World Layout Example</h2>
          <p className="text-muted-foreground">
            Combining Section, Container, Grid, Flex, and Stack components
          </p>
        </div>

        <Grid cols={3} gap="lg">
          <Stack gap="sm">
            <div className="h-24 bg-muted rounded-lg" />
            <h3 className="font-semibold">Card Title</h3>
            <p className="text-sm text-muted-foreground">
              Card description goes here
            </p>
          </Stack>
          <Stack gap="sm">
            <div className="h-24 bg-muted rounded-lg" />
            <h3 className="font-semibold">Card Title</h3>
            <p className="text-sm text-muted-foreground">
              Card description goes here
            </p>
          </Stack>
          <Stack gap="sm">
            <div className="h-24 bg-muted rounded-lg" />
            <h3 className="font-semibold">Card Title</h3>
            <p className="text-sm text-muted-foreground">
              Card description goes here
            </p>
          </Stack>
        </Grid>

        <Flex justify="between" align="center" className="border-t pt-8">
          <div>
            <p className="text-sm text-muted-foreground">© 2024 Company</p>
          </div>
          <Flex gap="lg">
            <a href="#" className="text-sm hover:underline">
              Privacy
            </a>
            <a href="#" className="text-sm hover:underline">
              Terms
            </a>
            <a href="#" className="text-sm hover:underline">
              Contact
            </a>
          </Flex>
        </Flex>
      </Stack>
    </Section>
  ),
};
