import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public', 'avatars');

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('avatar');
        const id = formData.get('id');
        console.log('[Avatar Upload] Received id:', id, 'file:', file && file.name);
        if (!file || !id) {
            console.error('[Avatar Upload] Missing file or id');
            return NextResponse.json({ error: 'Missing file or id' }, { status: 400 });
        }
        // Validate id
        const numId = Number(id);
        if (isNaN(numId)) {
            console.error('[Avatar Upload] Invalid id:', id);
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        }
        const ext = file.name.split('.').pop();
        const fileName = `${id}_${Date.now()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        console.log('[Avatar Upload] Saving file to:', filePath);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filePath, buffer);
        const avatarUrl = `/avatars/${fileName}`;
        console.log('[Avatar Upload] Updating DB for id:', numId, 'with url:', avatarUrl);
        // Try update
        let updated = null;
        try {
            updated = await prisma.contact.update({
                where: { id: numId },
                data: { avatar: avatarUrl },
            });
        } catch (prismaErr) {
            console.error('[Avatar Upload] Prisma update error:', prismaErr);
            throw prismaErr;
        }
        if (!updated) {
            console.error('[Avatar Upload] Contact not found for id:', numId);
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }
        console.log('[Avatar Upload] Success for id:', numId);
        return NextResponse.json({ avatar: avatarUrl });
    } catch (err) {
        // Log error for debugging
        console.error('[Avatar Upload] General error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}


