
export interface alert {
    icon: string;
    title: string;
    content: string;
}
export interface dashboard {
    registers: number;
    categories: number;
    providers: number;
    users: number;
    clients: number;
    products: number;
    buys: number;
    sells: number;
    repayment: number;
    kardex: number;
}
export interface register {
    id_register: number;
    name: string;
    state: string;
}
export interface category {
    id_category: number;
    name: string;
    ubication: string;
}
export interface provider {
    id_provider: number;
    document_type: string;
    document_number: number;
    name_provider: string;
    address_provider: string;
    name_boss: string;
    phone_number: number;
    email: string
}
export interface user {
    id_user: number;
    document_type_user: string;
    document_number_user: number;
    range_user: string;
    names_user: string;
    last_names_user: string;
    phone_number_user: number;
    gander_user: string;
    id_register: number;
    email_user: string;
    password_user: string;
    state_user: string;
}
export interface client {
    id_client: number;
    document_type_client: string;
    document_number_client: number;
    names_client: string;
    last_names_client: string;
    state_client: string;
    city_client: string;
    street_client: string;
    phone_number_client: number;
    email_client: string;
}

export interface product {
    id_product: number;
    barcode: string;
    name: string;
    garanty: string;
    mark: string;
    model: string;
    can_expir: boolean;
    expir: Date | null;
    time_garanty: Date;
    id_category: number;
    buy_price: number;
    sell_price: number;
    discount: number;
    impuest: number;
    sell_quantity: number;
    exist_quantity: number;
    coin: String;
}
export interface productByCategory {
    category: category;
    products: product[];
}
export interface buy {
    id_buy?: number;
    type?: string;
    time?: Date;
    total_buy: number;
    coin: string;
    buy_products: buy_product[];
    exchange: number,
    id_provider: number;
    id_user: number;
}
export interface fullBuy {
    provider: provider;
    user: user;
    buys: buy
}
export interface buy_product {
    id_buy: number;
    id_product: number
    buy_price: number
    sell_price: number
    weighted_averages_sell: number
    weighted_averages_buy: number
    quantity_products: number
    exist_products: number
    quantity_back: number
    discount_product: number
    impuest: number
}
export interface sell {
    id_sell: number;
    type?: string
    date?: Date;
    time?: Date;
    total_sell: number;
    coin: string;
    exchange: number;
    state: string;
    type_sell: string;
    total_pay: number;
    discount: number;
    id_user: number;
    id_client: number
    sell_products: sell_product[]
    pays: pay[]
}
export interface sell_product {
    id_sell: number;
    id_product: number
    buy_price: number
    sell_price: number
    discount_product: number
    impuest: number
    quantity_products: number
    exist_products: number
    quantity_back: number
}
export interface pay {
    id_pay: number;
    id_sell: number;
    type?: string;
    date?: Date;
    reference: number | null;
    mount: number;
    coin: string;
    exchange: number;
    id_user: number
    user?: user;
}
export interface repayment {
    id_repayment?: number;
    type: string;
    id_buy?: number;
    id_sell?: number;
    date?: Date;
    time?: Date;
    quantity: number;
    buy_price: number;
    sell_price: number;
    total: number;
    coin: string;
    exchange: number;
    exist_quantity: number;
    weighted_averages_sell: number;
    weighted_averages_buy: number;
    id_user: number;
    id_product: number;
}
export interface kardex {
    id_operation: number;
    id_product: number
    type: string;
    date: Date;
    time: Date;
    coin_kardex: string
    quantity_products: number
    exist: number;
    price: number;
    weighted_averages_sell: number;
    exchange: number;
    total: number;
}
export interface building {
    id_building: number;
    document_type: string;
    document_number: number;
    name: string;
    coin: string;
    address: string;
    name_tax: string;
    tax_rate: number;
    show_tax: boolean;
    email: string;
    phone_number: number;
    exchange_bs: number;
    exchange_dolar: number;
    exchange_euro: number;
}
export interface all_coins{
    country:string;
    country_code:string;
    language:string;
    language_code:string;
    currency:string;
    currency_code:string;
}
export interface coin {
    id_coin: number;
    name: string;
    symbol: string;
    type: string;
    exchange: number;
}