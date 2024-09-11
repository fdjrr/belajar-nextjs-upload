"use client";

import { UpdateImage } from "@/lib/action";
import { useFormState } from "react-dom";
import { SubmitButton } from "./button";
import type { Upload } from "@prisma/client";

const EditForm = ({ data }: { data: Upload }) => {
    const [state, formAction] = useFormState(
        UpdateImage.bind(null, data.id),
        null
    );

    return (
        <form action={formAction}>
            <div className="mb-4 pt-2">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    defaultValue={data?.title}
                />
                <div className="text-red-500 mt-1 text-sm">
                    {state?.error?.title}
                </div>
            </div>
            <div className="mb-4 pt-2">
                <input
                    type="file"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    name="image"
                />
                <div className="text-red-500 mt-1 text-sm">
                    {state?.error?.image}
                </div>
            </div>
            <div className="mb-4 pt-2">
                <SubmitButton label="upload" />
            </div>
        </form>
    );
};

export default EditForm;
