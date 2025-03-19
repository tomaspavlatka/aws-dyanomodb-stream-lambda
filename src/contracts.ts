type CompanyProfile = {
  id: string;
  easybillCustomerId: string;
};

type Billable = {
  id: string;
  companyId: string;
  externalId: string;
  payable: Payable[];
};

type Payable = {
  type: string;
  quantity: number;
  price: number;
};

// We need to use snake_case here
// because easybill expects values in
// snake_case format
type Invoice = {
  id: string;
  customer_id: string;
  type: 'INVOICE';
  items: InvoiceItem[];
};

// We need to use snake_case here
// because easybill expects values in
// snake_case format
type InvoiceItem = {
  description: string;
  quantity: number;
  single_price_net: number;
};
