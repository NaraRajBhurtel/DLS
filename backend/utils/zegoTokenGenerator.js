import crypto from "crypto";

/**
 * Generates a ZEGOCLOUD token for a user to join a room.
 * Works entirely in Node.js (no browser context needed).
 */
export const generateZegoToken = (appID, serverSecret, roomID, userID, effectiveTimeInSeconds = 3600, payload = '') => {
  const ALGORITHM = "sha256";
  const VERSION = "04";
  const nonce = Math.floor(Math.random() * 2147483647);
  const createTime = Math.floor(Date.now() / 1000);
  const expireTime = createTime + effectiveTimeInSeconds;

  const input = `${appID}${userID}${nonce}${expireTime}${payload}`;
  const hash = crypto.createHmac(ALGORITHM, serverSecret).update(input).digest("hex");

  const tokenObject = {
    version: VERSION,
    expired: expireTime,
    nonce,
    app_id: appID,
    user_id: userID,
    payload,
    room_id: roomID,
    signature: hash,
  };

  const base64Token = Buffer.from(JSON.stringify(tokenObject)).toString("base64");
  return base64Token;
};
