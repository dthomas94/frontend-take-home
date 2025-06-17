import { Tabs } from "radix-ui";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Role, User } from "./utils/types";
import { UsersTable } from "./components/tables/UsersTable";
import { deleteUser, getUsers, initApp, addUser as addUserApi } from "./api";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { SearchInput } from "./inputs/SearchInput";
import { Button } from "@radix-ui/themes";

function App() {
  const [userData, setUserData] = useState<User[]>([]);
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const searchUsers = useCallback(async (q?: string) => {
    const users = await getUsers(q);
    setUserData(users);
  }, []);

  const addUser = async (name: string) => {
    await addUserApi(name);
  };

  const removeUser = useCallback(async (id: string) => {
    const delUser = await deleteUser(id);
    if (delUser) {
      setUserData((prevData) => prevData.filter((user) => user.id !== id));
    }
  }, []);

  useEffect(() => {
    async function init() {
      const { users, roles } = await initApp();

      setUserData(users);
      setRolesData(roles);
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
          <Tabs.Trigger className="TabsTrigger" value="Roles">
            Roles
          </Tabs.Trigger>
        </Tabs.List>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchRef.current?.value) {
              addUser(searchRef.current.value);
            }
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
          <UsersTable data={userData} onClickRemoveUser={removeUser} />
        </Tabs.Content>
        <Tabs.Content value="roles">
          {rolesData.map((r) => r.description)}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export default App;
