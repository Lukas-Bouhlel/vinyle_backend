import env from "../../env";

const queryBuilder = {
  buildFind({ query = {} }: { query?: Record<string, any> } = {}) {
    const {
      sort = false,
      limit = env.API_DEFAUT_LIMIT,
      fields,
      embed,
      page = 1,
      ...rest
    } = query;
    const mongooseQuery = this.extractQuery(rest);
    const mongooseSort = this.extractSort(sort);
    // TODO Pagination!
    // {skip:10}, {limit:50}
    const mongooseLimit = this.extractLimit(limit);
    const mongooseSkip = this.extractSkip(page, limit);
    const mongooseProjection = this.extractSimpleProjection(fields);

    const mongooseEmbed = this.extractEmbed(embed);

    const findObjectParams = {
      filter: mongooseQuery,
      projection: mongooseProjection,
      options: {
        ...mongooseSort,
        ...mongooseEmbed,
        limit: mongooseLimit.limit,
        skip: mongooseSkip?.skip,
      },
    };
    console.log(JSON.stringify(findObjectParams, null, 2));
    return findObjectParams;
  },
  extractQuery(queryRest: any) {
    return { ...queryRest };
  },
  extractSort(sort: string | string[]) {
    const sortOptions: Record<string, number> = {};
    if (sort) {
      const sortStr = Array.isArray(sort) ? sort[0] : sort;
      if (sortStr.includes("-")) {
        const cleanParam = sortStr.slice(1);
        sortOptions[cleanParam] = -1;
      }
      else {
        sortOptions[sortStr] = 1;
      }
    }
    return { sort: sortOptions };
  },
  extractLimit(pLimit: number) {
    const limit = pLimit ?? env.API_DEFAUT_LIMIT;
    return { limit: Number(limit) };
  },
  extractSkip(page: number, pLimit: number) {
    const limit = pLimit ?? env.API_DEFAUT_LIMIT;
    if (page && page > 1) {
      return { skip: (page - 1) * limit };
    }
  },
  extractSimpleProjection(fields: string | undefined) {
    // Todo: handle exclude/include
    const projOptions: Record<string, number> = {};
    if (fields) {
      const fieldsList = fields.split(",");
      const onlyExclude = fieldsList.filter(elem => elem.includes("-"));
      onlyExclude.forEach((elem) => {
        const cleanField = elem.slice(1, elem.length); // remove - from param names
        projOptions[cleanField] = 0;
      });
    }
    return projOptions;
  },
  extractEmbed(embed: string | undefined) {
    const embedOptions: Record<string, any> = {};
    if (embed) {
      embedOptions.populate = { path: embed };
    }
    return embedOptions;
  },
};

export { queryBuilder };
