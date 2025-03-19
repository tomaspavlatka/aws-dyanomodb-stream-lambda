type CompanyProfile = {
  id: string,
  easybill_customer_id: string,
}

type Billable = {
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
  items: InvoiceItem[]
}

type InvoiceItem = {
  description: string,
  quantity: number,
  item_price_net: number,
}
