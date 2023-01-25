import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

const options = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  database: {
    type: "mongodb",
    database: ":auth:",
    synchronize: true,
  },
  session: {
    strategy: "jwt",
  },
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) { // https://www.reddit.com/r/nextjs/comments/m3f3h5/custom_roles_with_nextauth_jwt/
        // get user by email from mongo db
        const user_db = await (await clientPromise).db("auth").collection("users").findOne({ "email": user.email })
        token.roles = user_db.roles
      }
      return token
    }, async signIn({ user, account, profile, email, credentials }) {
      // get user by email from mongo db
      const user_db = await (await clientPromise).db("auth").collection("users").findOne({ "email": user.email })
      console.log("user_db", user_db)
      if (user_db !== null) {
        return true
      } else {
        return false
      }
    }
  }
};

export default (req, res) => NextAuth(req, res, options);