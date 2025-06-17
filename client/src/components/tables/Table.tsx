import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table as RTable } from "@radix-ui/themes";

type TableProps<T> = {
  data?: T[];
  columns: ColumnDef<T, any>[];
};

export function Table<T>({ data = [], columns }: TableProps<T>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <RTable.Root size="2" variant="surface">
      <RTable.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <RTable.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <RTable.ColumnHeaderCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </RTable.ColumnHeaderCell>
            ))}
          </RTable.Row>
        ))}
      </RTable.Header>
      <RTable.Body>
        {data.length ? (
          table.getRowModel().rows.map((row) => (
            <RTable.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <RTable.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </RTable.Cell>
              ))}
            </RTable.Row>
          ))
        ) : (
          <tr>
            <td>Loading...</td>
          </tr>
        )}
      </RTable.Body>
    </RTable.Root>
  );
}
