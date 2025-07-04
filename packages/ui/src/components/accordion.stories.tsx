import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion.js";

const meta = {
  title: "Primitives/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A vertically stacked set of interactive headings that reveal content sections.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      description:
        "Determines whether one or multiple items can be opened at the same time.",
      table: {
        defaultValue: { summary: "single" },
      },
    },
    collapsible: {
      control: "boolean",
      description:
        'When type is "single", allows closing content when clicking the open item.',
      table: {
        defaultValue: { summary: "false" },
      },
      if: { arg: "type", eq: "single" },
    },
    defaultValue: {
      control: "text",
      description: "The value of the item to expand by default.",
      if: { arg: "type", eq: "single" },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match the design system.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you
          prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const SingleExpanded: Story = {
  args: {
    type: "single",
    defaultValue: "item-2",
  },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Account Settings</AccordionTrigger>
        <AccordionContent>
          Manage your account settings and preferences here. You can update your
          profile information, change your password, and configure your
          notification preferences.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Privacy & Security</AccordionTrigger>
        <AccordionContent>
          Control your privacy settings and security options. Enable two-factor
          authentication, manage app permissions, and review your login history.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Billing Information</AccordionTrigger>
        <AccordionContent>
          View and manage your billing details, payment methods, and
          subscription plans. Download invoices and update your payment
          information.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: "multiple",
    defaultValue: ["item-1", "item-3"],
  },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Multiple items can be open</AccordionTrigger>
        <AccordionContent>
          This accordion allows multiple items to be expanded at the same time.
          Try clicking on other items - they won&apos;t close this one.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Flexible content management</AccordionTrigger>
        <AccordionContent>
          Perfect for FAQs, documentation, or any content where users might want
          to compare information across different sections.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Pre-expanded items</AccordionTrigger>
        <AccordionContent>
          You can set default expanded items using the defaultValue prop with an
          array of values.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <Accordion {...args}>
        <AccordionItem value="faq-1">
          <AccordionTrigger>
            What payment methods do you accept?
          </AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards (Visa, MasterCard, American
            Express), PayPal, and bank transfers for enterprise customers. All
            payments are processed securely through our payment partners.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>Can I change my plan later?</AccordionTrigger>
          <AccordionContent>
            Yes, you can upgrade or downgrade your plan at any time. When you
            upgrade, you&apos;ll be charged the prorated amount for the
            remainder of your billing cycle. When you downgrade, the changes
            will take effect at the start of your next billing cycle.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
          <AccordionContent>
            We offer a 30-day money-back guarantee for all new customers. If
            you&apos;re not satisfied with our service within the first 30 days,
            contact our support team for a full refund. After 30 days, refunds
            are provided on a case-by-case basis.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-4">
          <AccordionTrigger>Is my data secure?</AccordionTrigger>
          <AccordionContent>
            Absolutely. We use industry-standard encryption for all data in
            transit and at rest. Our infrastructure is hosted on secure cloud
            providers, and we perform regular security audits. We&apos;re also
            GDPR compliant and SOC 2 certified.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>Terms of Service</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <p>
              By using our services, you agree to be bound by these terms.
              Please read them carefully as they affect your rights and
              liabilities under the law.
            </p>
            <h4 className="font-semibold">1. Acceptance of Terms</h4>
            <p>
              By accessing and using this service, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
            <h4 className="font-semibold">2. Use License</h4>
            <p>
              Permission is granted to temporarily download one copy of the
              materials for personal, non-commercial transitory viewing only.
              This is the grant of a license, not a transfer of title.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Privacy Policy</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <p>
              Your privacy is important to us. This privacy policy explains what
              personal data we collect from you and how we use it.
            </p>
            <h4 className="font-semibold">Information We Collect</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Personal identification information (Name, email address, phone
                number, etc.)
              </li>
              <li>Usage data (How you interact with our service)</li>
              <li>
                Device information (IP address, browser type, operating system)
              </li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
