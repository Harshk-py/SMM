// /src/lib/models.ts
import mongoose, { Schema, InferSchemaType, models, model } from "mongoose";

const MessageSchema = new Schema(
  {
    from: { type: String },
    to: { type: String },
    text: { type: String },
    ts: { type: Date, default: Date.now },
    direction: { type: String, enum: ["in", "out"], required: true },
  },
  { _id: false }
);

const LeadSchema = new Schema(
  {
    psid: { type: String, index: true, unique: true, required: true }, // Page-scoped ID
    username: { type: String },
    tags: [{ type: String }],
    lastKeyword: { type: String },
    history: [MessageSchema],
  },
  { timestamps: true }
);

export type Lead = InferSchemaType<typeof LeadSchema>;
export const LeadModel = (models.Lead as mongoose.Model<Lead>) || model<Lead>("Lead", LeadSchema);
