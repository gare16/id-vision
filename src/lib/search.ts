import { FilterFn } from "@tanstack/react-table";

export const fuzzyFilter =
  <TData>(): FilterFn<TData> =>
  (row, columnId, value) => {
    const itemValue = String(row.getValue(columnId)).toLowerCase();
    return itemValue.includes(String(value).toLowerCase());
  };
