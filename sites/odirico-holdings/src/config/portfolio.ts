export type PortfolioCompany = {
  slug: string;
  name: string;
  industry: string;
  description: string;
  website?: string;
  logo?: string;
  image?: string;
  ownershipStatus: string;
  operatingStatus: string;
  corporateRelationship: string;
  legalStatusConfirmed: boolean;
  ownershipConfirmed: boolean;
  published: boolean;
  showParentDesignation?: boolean;
};
export const portfolio: PortfolioCompany[] = [
  {
    slug: "odirico-solutions",
    name: "Odirico Solutions",
    industry: "Pending confirmation",
    description: "",
    ownershipStatus: "Unconfirmed",
    operatingStatus: "Unconfirmed",
    corporateRelationship: "Unconfirmed",
    legalStatusConfirmed: false,
    ownershipConfirmed: false,
    published: false,
  },
];
export function getPublishedCompanies() {
  return portfolio.filter(
    (c) => c.published && c.legalStatusConfirmed && c.ownershipConfirmed,
  );
}
