
import { Responses } from './responses';
import { API_RESPONSE, THROW_API_ERROR } from '../../../../libs/Response';
import { Mysql } from '../../../../libs/Mysql';
import { AppDataSource, getDatabaseConnection } from "../../../../database/data-source";
import { CustomerRepository } from '../../../../repositories/CustomerRepository';

export async function execute(event: any): Promise<any> {
    try {
        const dataSource = await getDatabaseConnection();        
        const customer_repo = new CustomerRepository();
        const customer = await customer_repo.findAllCustomers();

        return API_RESPONSE({
            ...Responses.STATUS_200,
            body: JSON.stringify({ success: true, message: 'Success', data: customer }),
        });
    } catch (error: any) {
        console.log('[Create Customer] Error', error);
        return THROW_API_ERROR(error);
    } finally {
        await AppDataSource.destroy();
    }
}


