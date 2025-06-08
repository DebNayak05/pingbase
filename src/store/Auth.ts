import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: String | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,
      setHydrated() {
        // set((state) => ({
        //   hydrated : true
        // }))
        set({ hydrated: true });
      },
      async verifySession() {
        try {
          const session = await account.getSession("current");
          // set((state) => ({
          //   session:session
          // }))
          //no more need to rewrite all the variables using ...state -> this is the advantage of immer library!!!
          set({ session: session });
        } catch (error) {
          console.log(error);
        }
      },
      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const user = await account.get<UserPrefs>();
          const jwtResponse = await account.createJWT();
          const jwt = jwtResponse.jwt;
          if (!user.prefs?.reputation) {
            await account.updatePrefs({ reputation: 0 });
          }
          set((state) => ({
            session: session,
            user: user,
            jwt: jwt,
          }));
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      async createAccount(username: string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, username);
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      async logout() {
        await account.deleteSession("current");
        set((state) => ({
          session: null,
          jwt: null,
          user: null,
        }));
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
