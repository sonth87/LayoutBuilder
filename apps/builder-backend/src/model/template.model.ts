import mongoose, { Document, Schema } from "mongoose";
import { toJSON } from "./plugin/json";

export interface ITemplate extends Document {
  name: string;
  description?: string;
  slug: string;
  temp_type?: string;
  html: string;
  css?: string;
  brackets?: string[];
  fields?: Record<string, string>;
  values?: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    temp_type: {
      type: String,
      enum: ["html", "email", "web"],
      default: "html",
    },
    html: {
      type: String,
      required: true,
    },
    css: {
      type: String,
    },
    brackets: {
      type: [String],
      default: ["{{", "}}"],
    },
    fields: {
      type: Map,
      of: String,
      default: {},
    },
    values: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true },
);

TemplateSchema.plugin(toJSON);
export const Template = mongoose.model<ITemplate>("Template", TemplateSchema);
