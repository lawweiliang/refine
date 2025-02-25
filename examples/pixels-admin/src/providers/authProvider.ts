import { AuthBindings } from "@refinedev/core";

import { supabaseClient } from "utility";

export const authProvider: AuthBindings = {
    login: async ({ email, password, providerName }) => {
        try {
            // sign in with oauth
            if (providerName) {
                const { data, error } =
                    await supabaseClient.auth.signInWithOAuth({
                        provider: providerName,
                    });

                if (error) {
                    return {
                        success: false,
                        error,
                    };
                }

                if (data?.url) {
                    return {
                        success: true,
                    };
                }
            }

            // sign in with email and password
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email,
                    password,
                });

            if (error) {
                return {
                    success: false,
                    error,
                };
            }

            const role = data.user?.app_metadata?.role;

            if (role === "editor" || role === "admin") {
                return {
                    success: true,
                };
            }

            await supabaseClient.auth.signOut();

            return {
                success: false,
                error: new Error("User not authorized."),
            };
        } catch (error: any) {
            return {
                success: false,
                error,
            };
        }
    },
    register: async ({ email, password }) => {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
            });

            if (error) {
                return {
                    success: false,
                    error,
                };
            }

            const { user } = data;

            if (user) {
                return {
                    success: true,
                };
            }

            return {
                success: false,
                error: new Error("Register failed"),
            };
        } catch (error: any) {
            return {
                success: false,
                error,
            };
        }
    },
    forgotPassword: async ({ email }) => {
        try {
            const { data, error } =
                await supabaseClient.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/update-password`,
                });

            if (error) {
                return {
                    success: false,
                    error,
                };
            }

            if (data) {
                return {
                    success: true,
                };
            }

            return {
                success: false,
                error: new Error("Forgot Password password failed"),
            };
        } catch (error: any) {
            return {
                success: false,
                error,
            };
        }
    },
    updatePassword: async ({ password }) => {
        try {
            const { data, error } = await supabaseClient.auth.updateUser({
                password,
            });

            if (error) {
                return {
                    success: false,
                    error,
                };
            }

            if (data) {
                return {
                    success: true,
                    redirectTo: "/",
                };
            }

            return {
                success: false,
                error: new Error("Update Password password failed"),
            };
        } catch (error: any) {
            return {
                success: false,
                error,
            };
        }
    },
    logout: async () => {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            return {
                success: false,
                error,
            };
        }

        return {
            success: true,
            redirectTo: "/",
        };
    },
    onError: async (_error: any) => ({}),
    check: async () => {
        try {
            const { data } = await supabaseClient.auth.getSession();
            const { session } = data;

            if (!session) {
                return {
                    authenticated: false,
                    error: new Error("Not authenticated"),
                    logout: true,
                    redirectTo: "/login",
                };
            }
        } catch (error: any) {
            return {
                authenticated: false,
                error: error || new Error("Not authenticated"),
                logout: true,
                redirectTo: "/login",
            };
        }

        return {
            authenticated: true,
        };
    },
    getPermissions: async () => {
        try {
            const { error } = await supabaseClient.auth.getUser();

            if (error) {
                console.error(error);
                return;
            }

            const { data } = await supabaseClient.rpc("get_my_claim", {
                claim: "role",
            });

            return data;
        } catch (error: any) {
            console.error(error);
            return;
        }
    },
    getIdentity: async () => {
        try {
            const { data } = await supabaseClient.auth.getUser();

            if (data?.user) {
                return {
                    ...data.user,
                    name: data.user.email,
                };
            }

            return null;
        } catch (error: any) {
            console.error(error);

            return null;
        }
    },
};
