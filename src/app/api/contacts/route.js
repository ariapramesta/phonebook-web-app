import { prisma } from '@/lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const name = searchParams.get('name')
    const phone = searchParams.get('phone')
    const sortBy = searchParams.get('sortBy') || 'id'
    const sortMode = searchParams.get('sortMode') === 'asc' ? 'asc' : 'desc'

    const filters = {}

    if (name) {
        filters.name = {
            contains: name,
            mode: 'insensitive',
        }
    }

    if (phone) {
        filters.phone = {
            contains: phone,
            mode: 'insensitive',
        }
    }

    const total = await prisma.contact.count({ where: filters })
    const pages = Math.ceil(total / limit)

    const contacts = await prisma.contact.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortMode },
    })

    return Response.json({ phonebooks: contacts, page, pages })
}


export async function POST(req) {
    try {
        const data = await req.json();
        const contact = await prisma.contact.create({ data });
        return Response.json(contact);
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }

}
