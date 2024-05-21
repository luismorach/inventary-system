
export interface Alert {
    type: string;
    showAlert: boolean;
    title: string;
    description: string;
}

export interface AlertPay {
    showAlert: boolean;
    totalAmount: number;
    totalPaid: number;
}
export interface AlertListProducts {
    showAlert: boolean;
    actionType: string;
    currentProducts: Product[];
    productsList: Product[];
}
export interface ResponseAlert {
    type: string;
    response: boolean | number | Payment | Product;
}
export interface Dashboard {
    registers: number;
    categories: number;
    providers: number;
    users: number;
    clients: number;
    products: number;
    buys: number;
    sells: number;
    repayments: number;
    kardex: number;
}
export interface Register {
    id_register: number;
    name_register: string;
    state_register: string;
}
export interface Category {
    id_category: number;
    name: string;
    ubication: string;
}
export interface Provider {
    id_provider: number;
    document_type: string;
    document_number: number;
    name_provider: string;
    address_provider: string;
    name_boss: string;
    phone_number: number;
    email: string
}
export interface User {
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
    register?:Register
}
export interface Client {
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

export interface Product {
    id_product: number;
    barcode: string;
    name: string;
    garanty: string;
    mark: string;
    model: string;
    can_expir: boolean;
    expir: Date | null;
    time_garanty: string;
    time_unit:number
    id_category: number;
    cost: number;
    price: number;
    discount: number;
    tax_id: number;
    tax_rate: number;
    sell_quantity: number;
    exist_quantity: number;
}
export interface ProductByCategory {
    category: Category;
    products: Product[];
}
export interface Buy {
    id_buy: number;
    type?: string;
    time?: Date;
    total_buy: number;
    currency_code: string;
    buy_products: BuyProduct[];
    exchange: number,
    id_provider: number;
    id_user: number;
    user?:string
    provider?:string
    currency?:Currency
}

export interface BuyProduct {
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
    tax_rate:number
}
export interface Sell {
    id_sell: number;
    type?: string
    date?: Date;
    time?: Date;
    total_sell: number;
    currency_code: string;
    exchange: number;
    state: string;
    type_sell: string;
    total_paid: number;
    discount: number;
    id_user: number;
    id_client: number
    sell_products: SellProduct[]
    pays: Payment[]
}
export interface SellProduct {
    id_sell: number;
    id_product: number
    buy_price: number
    sell_price: number
    discount_product: number
    impuest?: Tax
    tax_rate:number
    quantity_products: number
    exist_products: number
    quantity_back: number
}
export interface Payment {
    id_payment: number;
    id_sell: number;
    type?: string;
    date?: Date;
    reference: number | null;
    mount: number;
    currency_code: string;
    exchange: number;
    id_user: number
    currency?:Currency
    user?: User;
}

export interface Repayment {
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
    currency_code: string;
    exchange: number;
    exist_quantity: number;
    weighted_averages_sell: number;
    weighted_averages_buy: number;
    id_user: number;
    id_product: number;
    user?:User | undefined
    currency?:Currency
    register?:Register
}
export interface Kardex {
    id_operation: number;
    id_product: number
    type: string;
    date: Date;
    time: Date;
    currency_code: string
    quantity_products: number
    exist: number;
    sell_price: number;
    weighted_averages_sell: number;
    exchange: number;
    total: number;
}
export interface Building {
    id_building: number;
    document_type: string;
    document_number: number;
    name: string;
    currency_code: string;
    address: string;
    email: string;
    phone_number: number;
    primaryCurrency:Currency;
    secondariesCoins:Currency[];
    email_password:string
}
export interface Currency{
    country:string;
    country_code:string;
    language:string;
    language_code:string;
    currency:string;
    currency_code:string;
    exchange:number;
}

export interface Tax {
    tax_id: number;
    tax_name: string;
    tax_rate: number;
    show_tax:string;
}
export interface report{
    costos:number;
    sells:number;
    total_sell:number
}
export interface Clock {
    hour: number;
    minutes: string;
    seconds: string;
    period: string;
}

export interface TableInfo {
    header?:{label:string,rowSpan:number,colSpan:number}[];
    tableTitle: string;
    searchField:string;
    enablePagination: boolean;
    enableSearch:boolean
}
export interface TableColumn {
    columnLabel: string;
    definition: string[];
    columnType:string
    pipeType?: string;
    options?: any;
}

export interface TableResponse {
    responseType: string;
    value: any;
    index:number
}
export interface SelectInfo {
    label: string;
    required: boolean;
    optionName: string[];
    definitionOption: string;
}
export interface ButtonInfo {
    text: string;
    icon: string;
    styleClass: string;
}
export interface ValidationResult { 
    isValid: boolean, 
    message: string
};
export interface SignUp{
    id_user:string
    names_user:string
    name_register:string
    id_register:number
    range_user:string
    id_building?:number
    token: string
    refreshToken: string
}


