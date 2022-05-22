type UserIdDecoder = (token: string | undefined) => string;

export const userIdDecoder: UserIdDecoder = (token) => {
    if (!token) return "";
    let decodedId: any = "";
    if (token.split(" ").length === 1) {
        decodedId = token.split(".")[1];
    } else {
        decodedId = token.split(" ")[1].split(".")[1];
    }
    decodedId = Buffer.from(decodedId, "base64").toString("binary");
    return JSON.parse(decodedId)._id;
};