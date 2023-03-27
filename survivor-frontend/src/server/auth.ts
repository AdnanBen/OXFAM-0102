import type { GetServerSidePropsContext } from "next";
import crypto from "crypto";
import {
  DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import jose from "jose";
import { JWT } from "next-auth/jwt/types.js";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../env/env.mjs";

async function getAzureGraphAccessToken() {
  const params = new URLSearchParams({
    client_id: env.AZURE_AD_B2C_CLIENT_ID,
    scope: "https://graph.microsoft.com/.default",
    client_secret: env.AZURE_AD_SERVER_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${env.AZURE_AD_SERVER_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    }
  ).then((res) => res.json());
  return res.access_token;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      isModerator: boolean;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    role: "Administrator" | "Moderator";
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  providers: [
    AzureADB2CProvider({
      checks: [],
      tenantId: env.AZURE_AD_B2C_TENANT_NAME,
      clientId: env.AZURE_AD_B2C_CLIENT_ID,
      clientSecret: env.AZURE_AD_B2C_CLIENT_SECRET,
      primaryUserFlow: env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
      authorization: { params: { scope: `offline_access openid` } },
      async profile(profile) {
        /**
         * Azure AD B2C requires a lot of configuration via custom policies to return the user email
         *  as a claim. See [1].
         * But this can become quite complex and requires additional configuration in Azure
         *  which would add another configuration/setup step when someone deploys this.
         * If we wanted to do it, instructions are at [2], [3].
         * We can use the Microsoft-provided starter pack also [4].
         *
         * So instead of doing that, we make an extra request to the MS Graph API, but as the
         *  application (daemon) rather than using the user-delegated token (which does not have
         *   permission to call Graph).
         *
         * [1] https://github.com/MicrosoftDocs/azure-docs/issues/16566
         * [2] https://docs.gitlab.com/ee/administration/auth/oidc.html#microsoft-azure-active-directory-b2c
         * [3] https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy
         * [4] https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/main/SocialAndLocalAccounts
         */
        const accessToken = await getAzureGraphAccessToken();
        const roleExtensionFieldName = `extension_${env.AZURE_AD_B2C_USER_EXTENSION_APP_ID}_Role`;
        const details = await fetch(
          `https://graph.microsoft.com/v1.0/users/${profile.sub}?$select=mail,givenName,${roleExtensionFieldName}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        ).then((res) => res.json());
        return {
          id: profile.sub,
          email: details.mail,
          name: details.givenName,
          role: details[roleExtensionFieldName],
          image: null,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.isModerator = user.role === "Moderator";
        token.isAdmin = user.role === "Administrator";
      }
      return token;
    },
    session({ session, token }) {
      session.user.isModerator = (token.isAdmin ||
        token.isModerator) as boolean;
      session.user.isAdmin = token.isAdmin as boolean;
      return session;
    },
  },
  jwt: {
    async encode(params: { token: JWT; secret: string; maxAge: number }) {
      const secretKey = crypto.createSecretKey(params.secret, "utf-8");
      const secondsSinceEpoch = Math.round(Date.now() / 1000);
      const jwt = await new jose.SignJWT(params.token)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setJti(crypto.randomUUID())
        .setExpirationTime(secondsSinceEpoch + params.maxAge)
        .sign(secretKey);

      return jwt;
    },
    async decode(params: { token: string; secret: string }) {
      const secretKey = crypto.createSecretKey(params.secret, "utf-8");
      const { payload } = await jose.jwtVerify(params.token, secretKey);
      return payload ?? null;
    },
  },
};

// There's no great way to test authentication
// https://github.com/nextauthjs/next-auth/discussions/2053#discussioncomment-1191016
// We create a Credentials Provider which accepts any email address to login as a moderator
// This ONLY exists in test environments
if (env.NODE_ENV === "test") {
  authOptions.providers.push(
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "Email",
        },
      },
      authorize() {
        return {
          id: "test",
          email: "test@example.com",
          name: "Name",
          role: "Moderator",
          image: null,
        };
      },
    })
  );
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
