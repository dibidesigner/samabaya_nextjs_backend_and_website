import mongoose, { Schema, Document } from "mongoose";

export interface BlacklistTokenDoc extends Document {
  token: string;
  expiresAt: Date;
}

const blacklistSchema = new Schema<BlacklistTokenDoc>({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});



const BlacklistToken = mongoose.models.BlacklistToken || mongoose.model("BlacklistToken", blacklistSchema);

export default BlacklistToken;
