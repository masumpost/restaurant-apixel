from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from bson import ObjectId

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'panshi-restaurant-secret-key-2024')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI(title="Panshi Restaurant API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class ProductBase(BaseModel):
    name_en: str
    name_bn: str
    category: str
    description: str
    price: float
    image_url: str
    in_stock: bool = True

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostBase(BaseModel):
    title: str
    slug: str
    content: str
    thumbnail_url: str
    author: str
    published: bool = False

class BlogPostCreate(BlogPostBase):
    pass

class BlogPost(BlogPostBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewBase(BaseModel):
    reviewer_name: str
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    approved: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactBase(BaseModel):
    name: str
    phone: str
    message: str

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

# ============== AUTH HELPERS ==============

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============== AUTH ROUTES ==============

@api_router.post("/auth/login")
async def login(credentials: UserLogin, response: Response):
    email = credentials.email.lower()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(user["id"], user["email"])
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=86400,
        path="/"
    )
    return {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"], "token": access_token}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

# ============== PRODUCT ROUTES ==============

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category and category != "All":
        query["category"] = category
    if search:
        query["$or"] = [
            {"name_en": {"$regex": search, "$options": "i"}},
            {"name_bn": {"$regex": search, "$options": "i"}}
        ]
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    for p in products:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'].replace('Z', '+00:00'))
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'].replace('Z', '+00:00'))
    return product

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate, request: Request):
    await get_current_user(request)
    product_obj = Product(**product.model_dump())
    doc = product_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return product_obj

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate, request: Request):
    await get_current_user(request)
    existing = await db.products.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = product.model_dump()
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'].replace('Z', '+00:00'))
    return updated

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    await get_current_user(request)
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

@api_router.patch("/products/{product_id}/stock")
async def toggle_product_stock(product_id: str, request: Request):
    await get_current_user(request)
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    new_stock = not product.get("in_stock", True)
    await db.products.update_one({"id": product_id}, {"$set": {"in_stock": new_stock}})
    return {"in_stock": new_stock}

@api_router.get("/categories")
async def get_categories():
    categories = await db.products.distinct("category")
    return ["All"] + categories

# ============== BLOG ROUTES ==============

@api_router.get("/blogs", response_model=List[BlogPost])
async def get_blogs(published_only: bool = True):
    query = {"published": True} if published_only else {}
    blogs = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for b in blogs:
        if isinstance(b.get('created_at'), str):
            b['created_at'] = datetime.fromisoformat(b['created_at'].replace('Z', '+00:00'))
    return blogs

@api_router.get("/blogs/all", response_model=List[BlogPost])
async def get_all_blogs(request: Request):
    await get_current_user(request)
    blogs = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for b in blogs:
        if isinstance(b.get('created_at'), str):
            b['created_at'] = datetime.fromisoformat(b['created_at'].replace('Z', '+00:00'))
    return blogs

@api_router.get("/blogs/{slug}", response_model=BlogPost)
async def get_blog_by_slug(slug: str):
    blog = await db.blog_posts.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    if isinstance(blog.get('created_at'), str):
        blog['created_at'] = datetime.fromisoformat(blog['created_at'].replace('Z', '+00:00'))
    return blog

@api_router.post("/blogs", response_model=BlogPost)
async def create_blog(blog: BlogPostCreate, request: Request):
    await get_current_user(request)
    blog_obj = BlogPost(**blog.model_dump())
    doc = blog_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.blog_posts.insert_one(doc)
    return blog_obj

@api_router.put("/blogs/{blog_id}", response_model=BlogPost)
async def update_blog(blog_id: str, blog: BlogPostCreate, request: Request):
    await get_current_user(request)
    existing = await db.blog_posts.find_one({"id": blog_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog not found")
    update_data = blog.model_dump()
    await db.blog_posts.update_one({"id": blog_id}, {"$set": update_data})
    updated = await db.blog_posts.find_one({"id": blog_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'].replace('Z', '+00:00'))
    return updated

@api_router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str, request: Request):
    await get_current_user(request)
    result = await db.blog_posts.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted"}

# ============== REVIEW ROUTES ==============

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews(approved_only: bool = True):
    query = {"approved": True} if approved_only else {}
    reviews = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for r in reviews:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'].replace('Z', '+00:00'))
    return reviews

@api_router.get("/reviews/all", response_model=List[Review])
async def get_all_reviews(request: Request):
    await get_current_user(request)
    reviews = await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for r in reviews:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'].replace('Z', '+00:00'))
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate):
    review_obj = Review(**review.model_dump())
    doc = review_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reviews.insert_one(doc)
    return review_obj

@api_router.patch("/reviews/{review_id}/approve")
async def toggle_review_approval(review_id: str, request: Request):
    await get_current_user(request)
    review = await db.reviews.find_one({"id": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    new_status = not review.get("approved", False)
    await db.reviews.update_one({"id": review_id}, {"$set": {"approved": new_status}})
    return {"approved": new_status}

@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, request: Request):
    await get_current_user(request)
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted"}

# ============== CONTACT ROUTES ==============

@api_router.post("/contacts", response_model=Contact)
async def create_contact(contact: ContactCreate):
    contact_obj = Contact(**contact.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    return contact_obj

@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts(request: Request):
    await get_current_user(request)
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for c in contacts:
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'].replace('Z', '+00:00'))
    return contacts

@api_router.delete("/contacts/{contact_id}")
async def delete_contact(contact_id: str, request: Request):
    await get_current_user(request)
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted"}

# ============== HEALTH CHECK ==============

@api_router.get("/")
async def root():
    return {"message": "Panshi Restaurant API", "status": "healthy"}

# Include the router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== SEED DATA ==============

async def seed_data():
    # Seed admin user
    admin_email = os.environ.get('ADMIN_EMAIL', 'Admin@restaurant.com').lower()
    admin_password = os.environ.get('ADMIN_PASSWORD', 'Admin@123')
    
    existing_admin = await db.users.find_one({"email": admin_email})
    if not existing_admin:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logger.info(f"Admin user created: {admin_email}")
    else:
        # Update password if changed
        if not verify_password(admin_password, existing_admin["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}}
            )
            logger.info("Admin password updated")
    
    # Seed sample products (Food Panda style Bengali cuisine)
    product_count = await db.products.count_documents({})
    if product_count == 0:
        sample_products = [
            # Rice & Biryani
            {"id": str(uuid.uuid4()), "name_en": "Kacchi Biryani", "name_bn": "কাচ্চি বিরিয়ানি", "category": "Biryani", "description": "Traditional Dhaka-style Kacchi biryani with tender mutton, fragrant rice, and saffron", "price": 350, "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Chicken Biryani", "name_bn": "চিকেন বিরিয়ানি", "category": "Biryani", "description": "Aromatic chicken biryani with basmati rice and special spices", "price": 280, "image_url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Plain Rice", "name_bn": "সাদা ভাত", "category": "Rice", "description": "Steamed basmati rice", "price": 60, "image_url": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Khichuri", "name_bn": "খিচুড়ি", "category": "Rice", "description": "Bengali comfort food - rice and lentils cooked with vegetables", "price": 150, "image_url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            
            # BBQ & Kebab
            {"id": str(uuid.uuid4()), "name_en": "Chicken Tikka", "name_bn": "চিকেন টিক্কা", "category": "BBQ", "description": "Grilled boneless chicken marinated in yogurt and spices", "price": 220, "image_url": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Beef Seekh Kebab", "name_bn": "বিফ সিখ কাবাব", "category": "BBQ", "description": "Minced beef kebabs grilled on skewers with fresh herbs", "price": 280, "image_url": "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Tandoori Chicken", "name_bn": "তন্দুরি চিকেন", "category": "BBQ", "description": "Half chicken marinated in tandoori spices and grilled in clay oven", "price": 350, "image_url": "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Reshmi Kebab", "name_bn": "রেশমি কাবাব", "category": "BBQ", "description": "Silky smooth chicken kebab with cream and cashew", "price": 260, "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            
            # Curry
            {"id": str(uuid.uuid4()), "name_en": "Beef Bhuna", "name_bn": "বিফ ভুনা", "category": "Curry", "description": "Slow-cooked beef curry with aromatic spices", "price": 300, "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Mutton Rezala", "name_bn": "মাটন রেজালা", "category": "Curry", "description": "Creamy white mutton curry, a Kolkata specialty", "price": 380, "image_url": "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Chicken Korma", "name_bn": "চিকেন কোরমা", "category": "Curry", "description": "Mild and creamy chicken curry with nuts", "price": 250, "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Fish Curry", "name_bn": "মাছের ঝোল", "category": "Curry", "description": "Traditional Bengali fish curry with mustard", "price": 280, "image_url": "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            
            # Drinks
            {"id": str(uuid.uuid4()), "name_en": "Borhani", "name_bn": "বোরহানি", "category": "Drinks", "description": "Traditional spiced yogurt drink, perfect with biryani", "price": 50, "image_url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Mango Lassi", "name_bn": "আমের লাচ্ছি", "category": "Drinks", "description": "Creamy mango yogurt smoothie", "price": 80, "image_url": "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Fresh Lime Water", "name_bn": "লেবুর শরবত", "category": "Drinks", "description": "Refreshing lime juice with mint", "price": 40, "image_url": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            
            # Desserts
            {"id": str(uuid.uuid4()), "name_en": "Firni", "name_bn": "ফিরনি", "category": "Desserts", "description": "Creamy rice pudding with cardamom and pistachios", "price": 80, "image_url": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Jilapi", "name_bn": "জিলাপি", "category": "Desserts", "description": "Crispy fried swirls soaked in sugar syrup", "price": 60, "image_url": "https://images.unsplash.com/photo-1666190050267-51ff04bc0736?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name_en": "Roshogolla", "name_bn": "রসগোল্লা", "category": "Desserts", "description": "Soft cottage cheese balls in sweet syrup", "price": 100, "image_url": "https://images.unsplash.com/photo-1601303470050-a8b1e89dceb4?w=400", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.products.insert_many(sample_products)
        logger.info(f"Seeded {len(sample_products)} sample products")
    
    # Seed sample reviews
    review_count = await db.reviews.count_documents({})
    if review_count == 0:
        sample_reviews = [
            {"id": str(uuid.uuid4()), "reviewer_name": "Rahman Khan", "rating": 5, "comment": "Best Kacchi biryani in Dhaka! Authentic taste and perfect portion size.", "approved": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "reviewer_name": "Fatima Ahmed", "rating": 5, "comment": "Amazing food quality and fast delivery. The Beef Bhuna is incredible!", "approved": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "reviewer_name": "Karim Hossain", "rating": 4, "comment": "Great taste, reasonable prices. Will order again!", "approved": True, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "reviewer_name": "Ayesha Begum", "rating": 5, "comment": "পানসির খাবার অসাধারণ! সবাইকে recommend করব।", "approved": True, "created_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.reviews.insert_many(sample_reviews)
        logger.info(f"Seeded {len(sample_reviews)} sample reviews")
    
    # Seed sample blog posts
    blog_count = await db.blog_posts.count_documents({})
    if blog_count == 0:
        sample_blogs = [
            {
                "id": str(uuid.uuid4()),
                "title": "The Art of Authentic Kacchi Biryani",
                "slug": "art-of-authentic-kacchi-biryani",
                "content": "<h2>A Culinary Heritage</h2><p>Kacchi biryani is not just a dish; it's a celebration of Bengali culinary tradition. At Panshi, we honor this heritage by preparing our biryani the traditional way - with raw marinated meat layered with partially cooked rice.</p><h2>Our Secret</h2><p>The secret lies in the slow cooking process. The meat releases its juices into the rice, creating layers of flavor that cannot be replicated by any shortcut method. We use only the finest basmati rice and premium quality mutton.</p><p>Each pot of biryani is sealed with dough and cooked over low heat for hours, allowing the flavors to meld perfectly.</p>",
                "thumbnail_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
                "author": "Chef Abdul",
                "published": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "5 Must-Try Bengali Desserts",
                "slug": "5-must-try-bengali-desserts",
                "content": "<h2>Sweet Endings</h2><p>Bengali cuisine is incomplete without its legendary desserts. Here are five that you absolutely must try:</p><h3>1. Roshogolla</h3><p>The iconic spongy cottage cheese balls soaked in light sugar syrup.</p><h3>2. Firni</h3><p>A creamy rice pudding flavored with cardamom and topped with pistachios.</p><h3>3. Mishti Doi</h3><p>Sweet yogurt set in clay pots, caramelized to perfection.</p><h3>4. Sandesh</h3><p>Delicate milk-based sweets in various flavors.</p><h3>5. Jilapi</h3><p>Crispy, spiraling treats soaked in sugar syrup.</p>",
                "thumbnail_url": "https://images.unsplash.com/photo-1601303470050-a8b1e89dceb4?w=600",
                "author": "Panshi Team",
                "published": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "From Our Kitchen to Your Table",
                "slug": "from-our-kitchen-to-your-table",
                "content": "<h2>Quality First</h2><p>At Panshi Restaurant, every dish that leaves our kitchen is prepared with love and care. We source the freshest ingredients daily from local markets.</p><h2>Our Promise</h2><p>Whether you're dining in or ordering through WhatsApp, we ensure the same quality and taste reaches you every time. Our packaging is designed to keep your food hot and fresh during delivery.</p><p>We believe in building relationships with our customers, one meal at a time.</p>",
                "thumbnail_url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
                "author": "Panshi Team",
                "published": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.blog_posts.insert_many(sample_blogs)
        logger.info(f"Seeded {len(sample_blogs)} sample blog posts")
    
    # Write test credentials
    credentials_dir = Path("/app/memory")
    credentials_dir.mkdir(exist_ok=True)
    credentials_file = credentials_dir / "test_credentials.md"
    credentials_content = f"""# Test Credentials

## Admin Account
- **Email**: {admin_email}
- **Password**: {admin_password}
- **Role**: admin

## Auth Endpoints
- POST /api/auth/login - Login with email/password
- POST /api/auth/logout - Logout
- GET /api/auth/me - Get current user
"""
    credentials_file.write_text(credentials_content)
    logger.info("Test credentials written to /app/memory/test_credentials.md")

@app.on_event("startup")
async def startup_event():
    await seed_data()
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.products.create_index("category")
    await db.blog_posts.create_index("slug", unique=True)
    logger.info("Database indexes created")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
