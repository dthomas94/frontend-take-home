import { Tabs } from "radix-ui";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { AppData } from "./utils/types";
import { UsersTable } from "./components/tables/UsersTable";
import { deleteRole, deleteUser, getRoles, getUsers, initApp } from "./api";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { SearchInput } from "./inputs/SearchInput";
import { Button } from "@radix-ui/themes";
import { RolesTable } from "./components/tables/RolesTable";

function App() {
  const [appData, setAppData] = useState<AppData>({ users: [], roles: [] });
  const searchRef = useRef<HTMLInputElement | null>(null);

  const searchUsers = useCallback(async (q?: string) => {
    const users = await getUsers(q);
    setAppData((prev) => ({ ...prev, users }));
  }, []);

  const searchRoles = useCallback(async (q?: string) => {
    const roles = await getRoles(q);
    setAppData((prev) => ({ ...prev, roles }));
  }, []);

  const removeUser = useCallback(async (id: string) => {
    const delUser = await deleteUser(id);
    if (delUser) {
      setAppData((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user.id !== id),
      }));
    }
  }, []);

  const removeRole = useCallback(async (id: string) => {
    const delRole = await deleteRole(id);
    if (delRole) {
      setAppData((prev) => ({
        ...prev,
        roles: prev.roles.filter((role) => role.id !== id),
      }));
    }
  }, []);

  useEffect(() => {
    async function init() {
      const { users, roles } = await initApp();

      setAppData(() => ({
        users,
        roles,
      }));
    }
    init();
  }, []);

  return (
    <div className="App">
      <Tabs.Root className="TabsRoot" defaultValue="users">
        <Tabs.List className="TabsList">
          <Tabs.Trigger className="TabsTrigger" value="users">
            Users
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="roles">
            Roles
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="users" className="TabsContent">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Add user");
              // if (searchRef.current?.value) {
              //   addUser(searchRef.current.value);
              // }
            }}
          >
            <SearchInput
              name="username"
              ref={searchRef}
              icon={<MagnifyingGlassIcon />}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                searchUsers(e.target.value)
              }
              placeholder="Search by name..."
            />
            <Button type="submit">
              <PlusIcon /> Add User
            </Button>
          </form>
          <UsersTable data={appData?.users} onClickRemoveUser={removeUser} />
        </Tabs.Content>
        <Tabs.Content value="roles" className="TabsContent">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Add Role");
              // if (searchRef.current?.value) {
              //   addRole(searchRef.current.value);
              // }
            }}
          >
            <SearchInput
              name="role"
              ref={searchRef}
              icon={<MagnifyingGlassIcon />}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                searchRoles(e.target.value)
              }
              placeholder="Search by role..."
            />
            <Button type="submit">
              <PlusIcon /> Add Role
            </Button>
          </form>
          <RolesTable data={appData?.roles} onClickRemoveRole={removeRole} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export default App;
