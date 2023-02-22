import { randomBytes, createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";
import PendingRegistration from "../models/PendingRegistration";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: "oxfam68@gmail.com", pass: "htdavwbbswkowvqg" },
});

const hash = (str: string) => createHash("md5").update(str).digest("hex");

async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  return transporter.sendMail({
    from: "oxfam68@gmail.com",
    to,
    subject,
    text,
    html,
  });
}

async function getAzureGraphAccessToken() {
  const params = new URLSearchParams({
    client_id: process.env.AZURE_AD_CLIENT_ID!,
    scope: "https://graph.microsoft.com/.default",
    client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
    grant_type: "client_credentials",
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    }
  ).then((res) => res.json());
  return res.access_token;
}

function validateAzureApiConnectorBasicAuth(authHeader: string) {
  return (
    "Basic " +
      Buffer.from(
        `${process.env.AZURE_API_CONNECTOR_USERNAME}:${process.env.AZURE_API_CONNECTOR_PASSWORD}`
      ).toString("base64") ===
    authHeader
  );
}

/**
 * API Connector from Azure AD B2B just before User Registration
 */
const createPendingRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!validateAzureApiConnectorBasicAuth(req.header("authorization") ?? "")) {
    return res.status(401).json({
      error:
        "You do not have permission to create a pending registration request",
    });
  }

  const token = randomBytes(64).toString("hex");
  const registration = new PendingRegistration({
    _id: req.body.email,
    ...req.body,
    token: hash(token),
  });

  try {
    // Send an email to Admin to approve this user
    if (process.env.NODE_ENV === "production") {
      await sendEmail({
        to: process.env.NEW_USER_VERIFIER_EMAIL!,
        subject: "Oxfam Survivors Community: verify moderator",
        text: `Please verify the following user: ${req.body.displayName} (${req.body.email}). ${process.env.BASE_URL}/pendingRegistrations/approve/${token}`,
        html: `Please verify the following user:<br/>${req.body.displayName} (${req.body.email}). ${process.env.BASE_URL}/pendingRegistrations/approve/${token}`,
      });
    } else {
      console.log("[Development] Would send email");
    }

    await registration.save();
    return res.json({
      version: "1.0.0",
      action: "ShowBlockPage",
      userMessage:
        "Your account is now pending approval. You'll be notified when your request has been approved.",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      version: "1.0.0",
      action: "ShowBlockPage",
      userMessage:
        "There was an unexpected error registering your account. Please try again later or contact the administator if the issue persists.",
    });
  }
};

const acceptPendingRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  const registration = (await PendingRegistration.findOne({
    token: { $eq: hash(token) },
  })) as any;
  if (!registration) return res.status(404);

  try {
    const accessToken = await getAzureGraphAccessToken();
    const result = await fetch("https://graph.microsoft.com/v1.0/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userPrincipalName: `${registration.email.replace(
          "@",
          "_"
        )}#EXT@oxfamsurvivorscommunity.onmicrosoft.com`,
        accountEnabled: true,
        mail: registration.email,
        mailNickname: registration.email.replace("@", "_"),
        identities: registration.identities,
        givenName: registration.givenName,
        surname: registration.surname,
        displayName:
          registration.displayName ||
          `${registration.givenName} ${registration.surname}`,
      }),
    });

    if (!result.ok) throw new Error("Unexpected error");
    const json = await result.json();
    if (json.error) throw new Error(json.error);

    // Send an email to User notifying them of approval
    if (process.env.NODE_ENV === "production") {
      await sendEmail({
        to: registration.email,
        subject: "Oxfam Survivors Community: account approved",
        text: `Your account has been approved`,
        html: `Your account has been approved`,
      });
    } else {
      console.log("[Development] Would send email to", registration.email);
    }

    await registration.deleteOne();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error:
        "There was an unexpected error accepting this pending registration. Please try again later or contact the administrator for support.",
    });
  }
};

export default {
  createPendingRegistration,
  acceptPendingRegistration,
};
