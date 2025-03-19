export type CompanyProfile = {
  easybillCustomerId: string;
  id: string;
};

export type Billable = {
  companyId: string;
  externalId: string;
  id: string;
  payable: Payable[];
};

export type Payable = {
  price: number;
  quantity: number;
  type: string;
};

// We need to use snake_case here
// because easybill expects values in
// snake_case format
export type Invoice = {
  customer_id: string;
  id: string;
  items: InvoiceItem[];
  type: 'INVOICE';
};

// We need to use snake_case here
// because easybill expects values in
// snake_case format
export type InvoiceItem = {
  description: string;
  quantity: number;
  single_price_net: number;
};
