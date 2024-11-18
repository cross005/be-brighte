import { EntityRepository, Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Customer } from "../entities/Customer";
import { CustomerCreateRequest } from "../functions/apis/customers/create/requests";

@EntityRepository(Customer)
export class CustomerRepository {
    private repository: Repository<Customer>;
    
    constructor() {
        this.repository = AppDataSource.getRepository(Customer);
    }
    
    async findAllCustomers() {
        return await this.repository.find();
    }
    
    async saveCustomer(body: CustomerCreateRequest) {
        try {
            console.log('body', body);
            const customer_repo = AppDataSource.getRepository(Customer);
            const customer_res =  await customer_repo.save(body);
            console.log('Customer has been saved: ');
            return customer_res;
        } catch (error) {
            console.error('Error saving user: ', error);
            throw error;
        }
    }
    
    // Add more custom methods as needed
}
