type CompanyProfile = {
  id: string,
  easybill_customer_id: string,
}

type Billable = {
  id: string;
  companyId: string,
  externalId: string;
  payable: Payable[],
}

type Payable = {
  type: string,
  quantity: number,
  price: number,
}

type Invoice = {
  id: string,
  customer_id: string,
  type: 'INVOICE',
  items: InvoiceItem[]
}

type InvoiceItem = {
  description: string,
  quantity: number,
  single_price_net: number,
}
