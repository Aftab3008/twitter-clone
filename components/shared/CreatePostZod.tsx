import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IoCloseSharp } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
import { cn, convertFileToUrl } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { createPost } from "@/lib/actions/posts.actions";
import { useUser } from "@clerk/nextjs";
import { useGetUser } from "@/hooks/useGetuser";
import toast from "react-hot-toast";
import { deletefiles } from "@/lib/uploadthingFunc";
import { Loader } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Theme } from "emoji-picker-react";

const formSchema = z.object({
  text: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
  image: z.instanceof(File).optional(),
});

export default function CreatePostZod() {
  const { user } = useUser();
  const { user: userData, loading, error } = useGetUser(user?.id!);
  const { startUpload } = useUploadThing("imageUploader");
  const [img, setImg] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [emojiopen, setEmojiopen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      image: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let imageUrl = undefined;
    if (values.image) {
      imageUrl = await startUpload([values.image]);
    }
    const newPost = await createPost({
      authorId: userData?._id!,
      text: values.text,
      postImg: imageUrl?.[0]?.url || undefined,
    });
    if (!newPost) {
      toast.error("Failed to create post");
      if (imageUrl) {
        await deletefiles(imageUrl[0].url);
      }
    } else {
      toast.success("Post created successfully");
    }
    setImg(null);
    form.reset();
  }

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={
              userData?.imgUrl || user?.imageUrl || "/avatar-placeholder.png"
            }
            alt="Profile"
          />
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="What is happening?!"
                    className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800 placeholder-opacity-60"
                    onFocus={() => setEmojiopen(false)}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {img && (
            <div className="relative w-72 mx-auto">
              <IoCloseSharp
                className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                onClick={() => {
                  setImg(null);
                  if (imgRef.current) imgRef.current.value = "";
                }}
              />
              <img
                src={img}
                className="w-full mx-auto h-72 object-contain rounded"
                onClick={() => {
                  imgRef.current?.click();
                }}
                alt="Selected"
              />
            </div>
          )}
          <div className="flex justify-between border-t py-2 border-t-gray-700">
            <div className="flex gap-1 items-center">
              <CiImageOn
                className="fill-blue-1 w-6 h-6 cursor-pointer"
                onClick={() => {
                  imgRef.current?.click();
                  setEmojiopen(false);
                }}
              />
              <div className="relative">
                <BsEmojiSmileFill
                  className="fill-blue-1 w-5 h-5 cursor-pointer"
                  onClick={() => setEmojiopen((prev) => !prev)}
                />
                <EmojiPicker
                  open={emojiopen}
                  onEmojiClick={(
                    emojiData: EmojiClickData,
                    event: MouseEvent
                  ) => {
                    form.setValue(
                      "text",
                      form.getValues("text") + emojiData.emoji
                    );
                  }}
                  style={{
                    color: "#fff",
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    left: 0,
                    zIndex: 999,
                  }}
                  theme={Theme.DARK}
                  autoFocusSearch={false}
                  className="epr_x558go"
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={imgRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          const file = e.target.files[0];
                          setImg(convertFileToUrl(file));
                          form.setValue("image", file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={cn(
                "btn rounded-full btn-sm text-white px-4 transition-all ease-in-out duration-300 bg-blue-1 hover:bg-blue-600 hover:border-blue-600 border-blue-1"
              )}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader size={30} color="white" className="animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
