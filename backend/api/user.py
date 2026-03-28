from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from api.db import prisma

router = APIRouter(prefix="/api/users", tags=["Users"])

class UserCreate(BaseModel):
    email: str
    name: Optional[str] = None
    role: str
    interests: List[str]
    readingMode: str

class UserUpdate(BaseModel):
    role: Optional[str] = None
    interests: Optional[List[str]] = None
    readingMode: Optional[str] = None

@router.on_event("shutdown")
async def shutdown():
    if prisma.is_connected():
        await prisma.disconnect()

@router.post("/")
async def create_user(user: UserCreate):
    try:
        new_user = await prisma.user.create(
            data={
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "interests": ",".join(user.interests),
                "readingMode": user.readingMode
            }
        )
        return new_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}")
async def get_user(user_id: str):
    user = await prisma.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}")
async def update_user(user_id: str, user_update: UserUpdate):
    update_data: dict = {}
    if user_update.role is not None:
        update_data["role"] = user_update.role
    if user_update.interests is not None:
        update_data["interests"] = ",".join(user_update.interests)
    if user_update.readingMode is not None:
        update_data["readingMode"] = user_update.readingMode

    try:
        updated_user = await prisma.user.update(
            where={"id": user_id},
            data=update_data
        )
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
