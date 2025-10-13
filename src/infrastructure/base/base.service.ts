import { HttpException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import {
  ISuccess,
  IFindOptions,
  IResponsePagination,
} from '../response/success.interface';
import { successRes } from '../response/success';
import { RepositoryPager } from '../pagination/RepositoryPager';

export class BaseService<CreateDto, UpdateDto, Entity extends { id: number }> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly model: any,
  ) {}

  get getRepository() {
    return this.model;
  }

  async create(dto: CreateDto): Promise<ISuccess> {
    const data = await this.model.create({ data: dto });
    return successRes(data, 201);
  }

  async findAll(options?: IFindOptions<Entity>): Promise<ISuccess> {
    const data = await this.model.findMany({
      where: options?.where,
      select: options?.select,
      include: options?.relations,
    });
    return successRes(data);
  }

  async findAllWithPagination(
    options?: IFindOptions<Entity> & { page?: number; pageSize?: number },
  ): Promise<IResponsePagination> {
    return RepositoryPager.findAll(this.getRepository, options);
  }

  async findOneBy(options: IFindOptions<Entity>): Promise<ISuccess> {
    const data = await this.model.findFirst({
      where: options.where,
      select: options.select,
      include: options.relations,
    });
    if (!data) {
      throw new HttpException('not found', 404);
    }
    return successRes(data);
  }

  async findOneById(
    id: number,
    options?: IFindOptions<Entity>,
  ): Promise<ISuccess> {
    const data = await this.model.findUnique({
      where: { id },
      select: options?.select,
      include: options?.relations,
    });
    if (!data) {
      throw new HttpException('not found', 404);
    }
    return successRes(data);
  }

  async update(id: number, dto: UpdateDto): Promise<ISuccess> {
    await this.findOneById(id);
    const data = await this.model.update({
      where: { id },
      data: dto,
    });
    return successRes(data);
  }

  async delete(id: number): Promise<ISuccess> {
    await this.findOneById(id);
    await this.model.delete({ where: { id } });
    return successRes({});
  }
}
