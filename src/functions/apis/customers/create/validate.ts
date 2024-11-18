import { joi } from '../../../../libs/Joi';
import { Validation } from '../../../../libs/Validation';
import { CustomerCreateRequest } from './requests';

export default (request: CustomerCreateRequest): CustomerCreateRequest => {
    let schema = joi
        .object({
            name: joi.string().required(),
            mobile: joi.string().required(),
            email: joi.string().required(),
            postcode: joi.string().required(),
            services: joi.string().valid('delivery', 'pick-up', 'payment').required()
        })
        .required();


    const validate = new Validation<CustomerCreateRequest>(schema);
    return validate.validate(request);
};
