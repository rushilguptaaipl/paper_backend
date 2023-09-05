import { plainToClass } from 'class-transformer';

export class getStudentCreditHistory {
  id: string;
  name: string;
  email: string;
}

export class RequestType {
  id: string;
  name: string;
}

export class ListTransactionAdmin {
  id: string;
  transaction_id
  credit_spent: string;
  credit_purchased: string;
  source: string;
  created_at: Date;
  student: getStudentCreditHistory;
  request_type: RequestType;
}

export class AdminListTransactionResponse {
    listStudentTransactionHistory: ListTransactionAdmin[];
    refetch: boolean;
  count: number;

  static decode(input: any): AdminListTransactionResponse {
    return plainToClass(this, input);
  }
}
