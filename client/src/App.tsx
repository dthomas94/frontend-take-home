import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Avatar, Tabs } from "radix-ui";
import { useEffect, useState } from "react";
import { User } from "./utils/types";

const columnHelper = createColumnHelper<User>();

const userColumns = [
  columnHelper.accessor((row) => `${row.first} ${row.last}`, {
    header: () => "User",
    id: "user",
    cell: ({ row }) => (
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
];

function App() {
  const [userData, setUserData] = useState<User[]>([]);
  const usersTable = useReactTable({
    columns: userColumns,
    data: userData,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(userData);

  useEffect(() => {
    async function getUsers() {
      const res = await fetch("http://localhost:3002/users");

      if (res.ok) {
        const userData = await res.json();

        setUserData(userData.data);
      }
    }
    getUsers();
  }, []);
  return (
    <div className="App">
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value="users">Users</Tabs.Trigger>
          <Tabs.Trigger value="Roles">Roles</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="users">
          <table>
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
              {usersTable.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {usersTable.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export default App;
