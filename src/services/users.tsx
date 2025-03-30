export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export const fetchUser = async (userId: string) => {
  console.log(`Fetching user with id ${userId}...`);
  const res = (await fetch(`https://reqres.in/api/users/${userId}`)).json();
  return res;
};

export const fetchUsers = async () => {
  console.log("Fetching users...");
  const res = (
    await fetch(`https://reqres.in/api/users`)
  ).json();
  return res;
};