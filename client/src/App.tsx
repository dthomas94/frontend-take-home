import { Tabs } from "radix-ui";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Role, User } from "./utils/types";
import { UsersTable } from "./components/tables/UsersTable";
import { deleteUser, getUsers, initApp } from "./api";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { SearchInput } from "./inputs/SearchInput";
import { Button } from "@radix-ui/themes";
import { RolesTable } from "./components/tables/RolesTable";

type AppData = {
  users: User[];
  roles: Role[];
};

function App() {
  const [appData, setAppData] = useState<AppData>({ users: [], roles: [] });
  const searchRef = useRef<HTMLInputElement | null>(null);

  const searchUsers = useCallback(async (q?: string) => {
    const users = await getUsers(q);
    setAppData((prev) => ({ ...prev, users }));
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

  console.log(appData.roles);

  return (
    <div className="App">
      <Tabs.Root className="TabsRoot" defaultValue="users">
        <Tabs.List className="TabsList" color="var(--purple-indicator)">
          <Tabs.Trigger className="TabsTrigger" value="users">
            Users
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="Roles">
            Roles
          </Tabs.Trigger>
        </Tabs.List>
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
        <Tabs.Content value="users" className="TabsContent">
          <UsersTable data={appData?.users} onClickRemoveUser={removeUser} />
        </Tabs.Content>
        <Tabs.Content value="roles">
          <RolesTable data={appData?.roles} onClickRemoveRole={() => {}} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export default App;
