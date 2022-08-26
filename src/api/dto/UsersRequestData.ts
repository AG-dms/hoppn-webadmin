export type OperatorType = 'co' | 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne' | 'sw';

export type UsersSortParamType = 'email' | 'first_name' | 'last_name' | 'status' | 'created_at';
export type SortParamsType = string | 'login';

export const formatDataBeforeFetch = (
  offset: number,
  limit: number,
  search: string,
  column: string,
  operator: OperatorType,
  sort: SortParamsType,
  direction: 'asc' | 'desc',
) => {
  let fixedOffset = offset;
  let fixedSearch = search;
  let fixedColumn = column;
  let fixedOperator = operator;
  let fixedSort = sort;

  if (offset === 0) {
    fixedOffset = undefined;
  }
  if (search === '') {
    fixedSearch = undefined;
    fixedColumn = undefined;
    fixedOperator = undefined;
  }
  if (direction === null) {
    fixedSort = undefined;
  }

  const checkFiled = field => {
    if (field === 'Email') {
      return 'email';
    }
    if (field === 'Login') {
      return 'login';
    }
    if (field === 'First name') {
      return 'first_name';
    }
    if (field === 'Last name') {
      return 'last_name';
    }

    if (field === 'Status') {
      return 'status';
    }
    return field;
  };
  return {
    offset: fixedOffset,
    limit,
    search: fixedSearch,
    column: checkFiled(fixedColumn),
    operator: fixedOperator,
    sort: checkFiled(fixedSort),
    direction,
  };
};

export type EditProfile = {
  first_name: string;
  last_name: string;
};

export type EditPasswordProfile = {
  currentPassword: string;
  newPassword: string;
};
