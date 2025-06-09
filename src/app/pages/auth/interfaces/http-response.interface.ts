import { PaginatorInterface } from '@modules/auth/interfaces/paginator.interface';

export interface HttpResponseInterface {
  data: any;
  pagination?: PaginatorInterface;
  error?: string;
  message: string;
  detail: string;
  statusCode: number;
  title: string;
  version?: string;
}

export interface ServerResponsePaginator extends HttpResponseInterface {
  meta: PaginatorInterface;
  links?: Links;
}

interface Links {
  first: string;
  last: string;
  prev: string;
  next: string;
}
