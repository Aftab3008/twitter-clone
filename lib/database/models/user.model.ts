import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    imgUrl: { type: String, default: "" },
    coverImgUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    link: { type: String, default: "" },
    clerkId: { type: String, required: true },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
