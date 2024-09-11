"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { clsx } from "clsx";
import Link from "next/link";
import { DeleteImage } from "@/lib/action";

export const SubmitButton = ({ label }: { label: string }) => {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={clsx(
                "w-full px-4 py-2 bg-blue-600 text-white rounded-md focus:outline-none",
                {
                    "opacity-50 cursor-progress": pending,
                }
            )}
        >
            {label === "upload" ? (
                <>{pending ? "Uploading..." : "Upload"}</>
            ) : (
                <>{pending ? "Submitting..." : "Submit"}</>
            )}
        </button>
    );
};

export const EditButton = ({ id }: { id: string }) => {
    return (
        <Link
            href={`edit/${id}`}
            className="py-3 px-6 bg-amber-400 w-full rounded-bl-md hover:bg-amber-500 text-white"
        >
            Edit
        </Link>
    );
};

export const DeleteButton = ({ id }: { id: string }) => {
    const deleteImageById = DeleteImage.bind(null, id);

    return (
        <form
            action={deleteImageById}
            className="py-3 px-6 bg-red-600 w-full rounded-br-md hover:bg-red-700 text-white"
        >
            <DeleteBtn />
        </form>
    );
};

const DeleteBtn = () => {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending}>
            {pending ? "Deleting..." : "Delete"}
        </button>
    );
};
