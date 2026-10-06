export const company = {
  name: "Odirico",
  displayName: "ŌDIRICO",
  domain: "odirico.com",
  description:
    "Odirico is a private holding company focused on building, acquiring, and supporting businesses for the long term.",
};
export const activities = [
  {
    title: "Build",
    description:
      "Create businesses where we see an opportunity to develop something valuable from the ground up.",
  },
  {
    title: "Acquire",
    description:
      "Pursue businesses where patient ownership and long-term thinking can create additional value.",
  },
  {
    title: "Support",
    description:
      "Provide operating companies with strategic direction, systems, and resources where they add value.",
  },
];
export const approach = [
  {
    title: "Build",
    description:
      "Start with a clear purpose and a real need. Develop businesses with the people, processes, and foundations to stand on their own.",
  },
  {
    title: "Acquire",
    description:
      "Consider what makes a business durable and what its next chapter requires. Pursue opportunities where our approach to ownership fits the business and its people.",
  },
  {
    title: "Operate",
    description:
      "Support accountable leadership close to the work. Preserve independent identities and give operating teams room to make decisions within a clear direction.",
  },
  {
    title: "Allocate",
    description:
      "Weigh the use of capital, time, and attention carefully. Invest in the foundations of a business, share resources where useful, and favor lasting value over growth for appearance.",
  },
];
export const principles = [
  {
    title: "A long horizon",
    description:
      "Make decisions with the lasting health of the business in mind.",
  },
  {
    title: "Independent identities",
    description:
      "Let each operating company retain the identity and relationships that make it valuable.",
  },
  {
    title: "Discipline in allocation",
    description:
      "Direct capital and attention where they can support enduring enterprise value.",
  },
  {
    title: "Autonomy with accountability",
    description:
      "Keep operating decisions close to the business, with clear responsibilities and thoughtful oversight.",
  },
  {
    title: "Shared resources, selectively",
    description:
      "Develop common systems and infrastructure when they genuinely help the businesses using them.",
  },
  {
    title: "Growth with purpose",
    description:
      "Build capability and resilience before pursuing size for its own sake.",
  },
];
export type Milestone = {
  date: string;
  title: string;
  description: string;
  verified: boolean;
};
export const milestones: Milestone[] = [];
