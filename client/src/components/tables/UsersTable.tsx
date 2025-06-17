import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { User } from "../../utils/types";
import { Avatar, DropdownMenu } from "radix-ui";
import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button, Flex, IconButton } from "@radix-ui/themes";

type UsersTableProps = {
  data: User[];
  onClickRemoveUser: (id: string) => void;
};

const columnHelper = createColumnHelper<User>();
export function UsersTable({ data, onClickRemoveUser }: UsersTableProps) {
  const userColumns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.first} ${row.last}`, {
        header: () => "User",
        id: "user",
        cell: ({ row }) => (
          <Flex>
            <Avatar.Root className="AvatarRoot">
              <Avatar.Image
                className="AvatarImage"
                height="24"
                width="24"
                src={row.original.photo}
                alt={`${row.original.first}${row.original.last}`}
              />
              <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                {row.original.first[0]}
                {row.original.last[0]}
              </Avatar.Fallback>
            </Avatar.Root>
            <span>
              {row.original.first} {row.original.last}
            </span>
          </Flex>
        ),
      }),
      columnHelper.accessor("roleId", {
        header: () => "Role",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("createdAt", {
        header: () => <span>Joined</span>,
        cell: ({ row }) => {
          const joined = new Date(row.original.createdAt);
          return (
            <span>
              {joined.toLocaleDateString("en-EN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (props) => (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton variant="ghost">
                <DotsHorizontalIcon color="var(--gray-a11)" />
              </IconButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="DropdownContent">
                <DropdownMenu.Item
                  onClick={() => onClickRemoveUser(props.row.original.id)}
                  asChild
                >
                  <Button variant="ghost">
                    <TrashIcon />
                    <span>Remove User</span>
                  </Button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ),
      }),
    ],
    [onClickRemoveUser]
  );

  const usersTable = useReactTable({
    columns: userColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table cellSpacing={0}>
      <thead>
        {usersTable.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {data.length ? (
          usersTable.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td>Loading...</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
