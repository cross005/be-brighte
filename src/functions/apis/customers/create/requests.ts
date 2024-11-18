export class CustomerCreateRequest {
    name: string;
    email: string;
    mobile: string;
    postcode: string;
    services: Services;
}

export enum Services {
    DELIVERY = 'delivery',
    PICK_UP = 'pick-up',
    PAYMENT = 'payment'
}