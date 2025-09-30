import { IFindOptions, IResponsePagination } from '../response/success.interface';
import { Pager } from './Pager';

export class RepositoryPager {
  public static readonly DEFAULT_PAGE = 1;
  public static readonly DEFAULT_PAGE_SIZE = 10;

  public static async findAll<T>(
    model: any,
    options?: IFindOptions<T> & { page?: number; pageSize?: number },
  ): Promise<IResponsePagination> {
    const page = options?.page ?? this.DEFAULT_PAGE;
    const pageSize = options?.pageSize ?? this.DEFAULT_PAGE_SIZE;

    const [data, totalElements] = await Promise.all([
      model.findMany({
        where: options?.where,
        select: options?.select,
        include: options?.relations,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      model.count({ where: options?.where }),
    ]);

    return Pager.of(200, 'success', data, totalElements, pageSize, page);
  }
}
