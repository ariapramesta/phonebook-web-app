import { prisma } from "@/lib/prisma"

export async function PUT(request, context) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const contact = await prisma.contact.update({
            where: { id: Number(id) },
            data: body,
        });
        return Response.json(contact, { status: 201 });
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    try {
        const { id } = await context.params;
        const contact = await prisma.contact.delete({
            where: { id: Number(id) }
        });
        return Response.json(contact, { status: 200 });
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 });
    }
}
