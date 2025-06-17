import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { Role } from "../../utils/types";
import { DropdownMenu } from "radix-ui";
import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button, IconButton } from "@radix-ui/themes";
import { Table } from "./Table";

type RolesTableProps = {
  data?: Role[];
  onClickRemoveRole: (id: string) => void;
};

const columnHelper = createColumnHelper<Role>();
export function RolesTable({ data, onClickRemoveRole }: RolesTableProps) {
  console.log(data);
  const roleColumns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => "Role",
        cell: (info) => info.renderValue(),
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
                  onClick={() => onClickRemoveRole(props.row.original.id)}
                  asChild
                >
                  <Button variant="ghost">
                    <TrashIcon />
                    <span>Remove Role</span>
                  </Button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ),
      }),
    ],
    [onClickRemoveRole]
  );

  return <Table<Role> data={data} columns={roleColumns} />;
}
