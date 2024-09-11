import { prisma } from "@/lib/prisma";

export const getImages = async () => {
    try {
        const results = await prisma.upload.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return results;
    } catch (e) {
        throw new Error("Failed to fetch data");
    }
};

export const getImageById = async (id: string) => {
    try {
        const results = await prisma.upload.findUnique({
            where: {
                id,
            },
        });

        return results;
    } catch (e) {
        throw new Error("Failed to fetch data");
    }
};
