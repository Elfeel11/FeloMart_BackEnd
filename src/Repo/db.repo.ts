import type { UpdateOptions } from "mongodb";
import type {
  AnyKeys,
  ApplyBasicCreateCasting,
  CreateOptions,
  DeepPartial,
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Require_id,
  Types,
  UpdateQuery,
} from "mongoose";

abstract class DBRepo<T> {
  constructor(protected Model: Model<T>) {}

  public async create({
    data,
    options,
  }: {
    data: any;
    options?: CreateOptions;
  }) {
    return await this.Model.create(data, options);
  }

  public async findOne({
    filter,
    projection,
    options,
  }: {
    filter?: QueryFilter<T>;
    projection?: ProjectionType<T> | null | undefined;
    options?: QueryOptions<T>;
  }) {
    return await this.Model.findOne(filter, projection, options);
  }

  public async find({
    filter,
    projection,
    options,
  }: {
    filter?: QueryFilter<T>;
    projection?: ProjectionType<T> | null | undefined;
    options?: QueryOptions<T>;
  }) {
    return await this.Model.find(filter, projection, options);
  }

  public async findById({
    _id,
    projection,
    options,
  }: {
    _id: string | Types.ObjectId;
    projection?: ProjectionType<T> | null | undefined;
    options?: QueryOptions<T>;
  }) {
    return await this.Model.findById(_id, projection, options);
  }

  public async updateOne({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<T>;
    update: UpdateQuery<T>;
    options?: UpdateOptions;
  }) {
    return await this.Model.updateOne(filter, update, options);
  }

  public async findOneAndUpdate({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<T>;
    update: UpdateQuery<T>;
    options?: QueryOptions<T>;
  }) {
    return await this.Model.findOneAndUpdate(filter, update, options);
  }

  public getDBDoc(data: any) {
    return new this.Model(data);
  }

  public async paginate({
    filter,
    page,
    size,
    options,
    projection,
  }: {
    filter?: QueryFilter<T>;
    projection?: ProjectionType<T> | null | undefined;
    page?: number;
    size?: number;
    options?: QueryOptions<T>;
  }) {
    const actualPage = page || 1;
    const actualSize = size || 3;
    const skip = (actualPage - 1) * actualSize;

    const docs = await this.Model.find(filter, projection, options)
      .skip(skip)
      .limit(actualSize);

    const docCounts = await this.Model.countDocuments(filter);
    return {
      docs,
      currentPage: actualPage,
      size: actualSize,
      totalPages: Math.ceil(docCounts / actualSize),
      totalDocs: docCounts,
    };
  }
}

export default DBRepo;
