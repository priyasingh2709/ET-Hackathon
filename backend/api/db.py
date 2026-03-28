from prisma import Client

prisma = Client()

async def connect_db():
    if not prisma.is_connected():
        await prisma.connect()

async def disconnect_db():
    if prisma.is_connected():
        await prisma.disconnect()
