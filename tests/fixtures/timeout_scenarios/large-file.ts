// This file simulates a scenario that could trigger timeout
// In real testing, we might need to create a mock slow formatter

const data = [
${Array(1000).fill(0).map((_, i) => `  { id: ${i}, value: "item${i}", data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },`).join('\n')}
];

// Many functions to process
${Array(100).fill(0).map((_, i) => `
function process${i}(input: any): any {
  const result = input.map((item: any) => ({
    ...item,
    processed: true,
    timestamp: Date.now(),
    index: ${i}
  }));
  return result;
}
`).join('\n')}

export { data };