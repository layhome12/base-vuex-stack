type PaginateInput = {
  page: number;
  limit: number;
  sortBy?: string;
  sortType?: string;
};

type PaginateOutput = {
  items: any[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

type PaginateOptions = {
  allowedOrderColumn: string[];
};
