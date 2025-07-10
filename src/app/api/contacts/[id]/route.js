import { prisma } from "@/lib/prisma"

export async function PUT(request, { params }) {
    try {
        const body = await request.json()
        const contact = await prisma.contact.update({
            where: { id: Number(params.id) },
            data: body,
        })

        return Response.json(contact, { status: 201 })
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const contact = await prisma.contact.delete({
            where: { id: Number(params.id) }
        });
        return Response.json(contact, { status: 200 });
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }

}
