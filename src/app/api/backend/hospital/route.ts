import {prisma} from "@/lib/prisma";
import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

export async function GET(): Promise<Response> {
    const hospital = await prisma.hospital.findMany({});
    return NextResponse.json(hospital);
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const payload: {
            name: string,
            email: string,
            logo: string,
            banner: string,
            description: string,
            city: string,
            mobile: string,
            country: string
        } = {
            name: body.name,
            email: body.email,
            logo: body.logo,
            banner: body.banner ?? null,
            description: body.description,
            city: body.city ?? null,
            mobile: body.mobile,
            country: body.country,
        };

        const newHospital = await prisma.hospital.create({data: payload});

        return NextResponse.json(newHospital);
    } catch (err) {
        console.error("", err);
        return NextResponse.json(
            {error: "Failed to create hospital"},
            {status: 500},
        );
    }
}
