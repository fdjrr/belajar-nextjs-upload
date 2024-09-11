"use server";

import { z } from "zod";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getImageById } from "./data";

const UploadSchema = z.object({
    title: z.string().min(3),
    image: z
        .instanceof(File)
        .refine((file) => file.size > 0, { message: "Image is required." })
        .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
            message: "Image must be an image.",
        })
        .refine((file) => file.size < 5e6, {
            message: "Image must be less than 5MB.",
        }),
});

const UpdateSchema = z.object({
    title: z.string().min(3),
    image: z
        .instanceof(File)
        .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
            message: "Image must be an image.",
        })
        .refine((file) => file.size < 5e6, {
            message: "Image must be less than 5MB.",
        })
        .optional(),
});

export const UploadImage = async (prevState: unknown, formData: FormData) => {
    const validatedFields = UploadSchema.safeParse(
        Object.fromEntries(formData)
    );

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, image } = validatedFields.data;

    const { url } = await put(image.name, image, {
        access: "public",
        multipart: true,
    });

    try {
        await prisma.upload.create({
            data: {
                title,
                image: url,
            },
        });
    } catch (e) {
        return { message: "Failed to create data!" };
    }

    revalidatePath("/");

    redirect("/");
};

export const UpdateImage = async (
    id: string,
    prevState: unknown,
    formData: FormData
) => {
    const validatedFields = UpdateSchema.safeParse(
        Object.fromEntries(formData)
    );

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = await getImageById(id);

    if (!data) return { message: "Failed to update data!" };

    const { title, image } = validatedFields.data;

    let imagePath;

    if (!image || image.size <= 0) {
        imagePath = data.image;
    } else {
        await del(data.image);

        const { url } = await put(image.name, image, {
            access: "public",
            multipart: true,
        });

        imagePath = url;
    }

    try {
        await prisma.upload.update({
            where: {
                id,
            },
            data: {
                title,
                image: imagePath,
            },
        });
    } catch (e) {
        return { message: "Failed to update data!" };
    }

    revalidatePath("/");

    redirect("/");
};

export const DeleteImage = async (id: string) => {
    const data = await getImageById(id);

    if (!data) return { message: "Failed to delete data!" };

    await del(data.image);

    try {
        await prisma.upload.delete({
            where: {
                id,
            },
        });
    } catch (e) {
        return { message: "Failed to delete data!" };
    }

    revalidatePath("/");

    redirect("/");
};
