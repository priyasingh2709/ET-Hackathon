import stripe
import os
from fastapi import APIRouter, HTTPException, Query
from api.db import prisma

router = APIRouter(prefix="/api/payment", tags=["Payment"])

# Initialize Stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

@router.post("/create-checkout-session")
async def create_checkout_session(user_id: str = Query(...)):
    """Creates a Stripe checkout session for subscription."""
    if not stripe.api_key:
        return {"url": "http://localhost:5174/feed?error=missing_stripe_key"}
        
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            client_reference_id=user_id,
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': 'News Navigator Premium',
                            'description': 'Unlimited AI insights, advanced RAG memory, and personalized daily briefings.'
                        },
                        'unit_amount': 999, # $9.99
                        'recurring': {'interval': 'month'}
                    },
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url='http://localhost:5174/feed?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:5174/feed',
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/verify-session")
async def verify_session(session_id: str = Query(...)):
    """Verifies a Stripe session and upgrades user status."""
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe API key not configured")
        
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == 'paid':
            user_id = session.client_reference_id
            if user_id:
                # Upgrade user to premium
                await prisma.user.update(
                    where={"id": user_id},
                    data={"isPremium": True}
                )
                return {"status": "success", "message": "User upgraded to premium"}
            else:
                return {"status": "error", "message": "No user_id found in session"}
        return {"status": "pending", "message": "Payment not yet confirmed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

