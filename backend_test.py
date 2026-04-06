#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class RestaurantAPITester:
    def __init__(self, base_url="https://panshi-dining.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)
            elif method == 'PATCH':
                response = self.session.patch(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.content else {}
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        return self.run_test("API Health Check", "GET", "", 200)

    def test_admin_login(self):
        """Test admin login and get token"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@restaurant.com", "password": "Admin@123"}
        )
        if success and 'id' in response:
            # Check if cookies are set for auth
            print(f"   Login successful for user: {response.get('email')}")
            return True
        return False

    def test_auth_me(self):
        """Test getting current user info"""
        return self.run_test("Get Current User", "GET", "auth/me", 200, auth_required=True)

    def test_products_endpoints(self):
        """Test product-related endpoints"""
        print("\n📦 Testing Product Endpoints...")
        
        # Get all products
        success, products = self.run_test("Get All Products", "GET", "products", 200)
        if not success:
            return False
            
        print(f"   Found {len(products)} products")
        
        # Get categories
        success, categories = self.run_test("Get Categories", "GET", "categories", 200)
        if success:
            print(f"   Found categories: {categories}")
        
        # Test category filtering
        if categories and len(categories) > 1:
            category = categories[1] if categories[1] != "All" else categories[0]
            success, filtered = self.run_test(
                f"Filter by Category: {category}", 
                "GET", 
                f"products?category={category}", 
                200
            )
        
        # Test search
        success, searched = self.run_test(
            "Search Products", 
            "GET", 
            "products?search=chicken", 
            200
        )
        
        # Test individual product
        if products and len(products) > 0:
            product_id = products[0]['id']
            success, product = self.run_test(
                "Get Single Product", 
                "GET", 
                f"products/{product_id}", 
                200
            )
        
        return True

    def test_blogs_endpoints(self):
        """Test blog-related endpoints"""
        print("\n📝 Testing Blog Endpoints...")
        
        # Get published blogs
        success, blogs = self.run_test("Get Published Blogs", "GET", "blogs", 200)
        if success:
            print(f"   Found {len(blogs)} published blogs")
        
        # Test individual blog by slug
        if blogs and len(blogs) > 0:
            blog_slug = blogs[0]['slug']
            success, blog = self.run_test(
                "Get Blog by Slug", 
                "GET", 
                f"blogs/{blog_slug}", 
                200
            )
        
        return success

    def test_reviews_endpoints(self):
        """Test review-related endpoints"""
        print("\n⭐ Testing Review Endpoints...")
        
        # Get approved reviews
        success, reviews = self.run_test("Get Approved Reviews", "GET", "reviews", 200)
        if success:
            print(f"   Found {len(reviews)} approved reviews")
        
        # Create a new review
        test_review = {
            "reviewer_name": "Test User",
            "rating": 5,
            "comment": "Great food and service!"
        }
        success, created_review = self.run_test(
            "Create Review", 
            "POST", 
            "reviews", 
            200, 
            data=test_review
        )
        
        return success

    def test_contact_endpoints(self):
        """Test contact-related endpoints"""
        print("\n📞 Testing Contact Endpoints...")
        
        # Create a contact message
        test_contact = {
            "name": "Test Customer",
            "phone": "+8801234567890",
            "message": "I would like to make a reservation for 4 people."
        }
        success, created_contact = self.run_test(
            "Create Contact Message", 
            "POST", 
            "contacts", 
            200, 
            data=test_contact
        )
        
        return success

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n🔐 Testing Admin Endpoints...")
        
        # Get all blogs (admin)
        success, all_blogs = self.run_test(
            "Get All Blogs (Admin)", 
            "GET", 
            "blogs/all", 
            200, 
            auth_required=True
        )
        
        # Get all reviews (admin)
        success, all_reviews = self.run_test(
            "Get All Reviews (Admin)", 
            "GET", 
            "reviews/all", 
            200, 
            auth_required=True
        )
        
        # Get contacts (admin)
        success, contacts = self.run_test(
            "Get Contacts (Admin)", 
            "GET", 
            "contacts", 
            200, 
            auth_required=True
        )
        
        if success:
            print(f"   Found {len(contacts)} contact messages")
        
        return success

    def test_unauthorized_access(self):
        """Test that admin endpoints require authentication"""
        print("\n🚫 Testing Unauthorized Access...")
        
        # Try to access admin endpoints without auth
        success, _ = self.run_test(
            "Unauthorized Blog Access", 
            "GET", 
            "blogs/all", 
            401
        )
        
        success2, _ = self.run_test(
            "Unauthorized Contact Access", 
            "GET", 
            "contacts", 
            401
        )
        
        return success and success2

def main():
    print("🍽️  Starting Panshi Restaurant API Tests")
    print("=" * 50)
    
    tester = RestaurantAPITester()
    
    # Test sequence
    tests = [
        ("Health Check", tester.test_health_check),
        ("Admin Login", tester.test_admin_login),
        ("Auth Me", tester.test_auth_me),
        ("Products", tester.test_products_endpoints),
        ("Blogs", tester.test_blogs_endpoints),
        ("Reviews", tester.test_reviews_endpoints),
        ("Contacts", tester.test_contact_endpoints),
        ("Admin Endpoints", tester.test_admin_endpoints),
        ("Unauthorized Access", tester.test_unauthorized_access),
    ]
    
    for test_name, test_func in tests:
        try:
            print(f"\n{'='*20} {test_name} {'='*20}")
            test_func()
        except Exception as e:
            print(f"❌ Test suite '{test_name}' failed with error: {e}")
            tester.failed_tests.append({
                "test_suite": test_name,
                "error": str(e)
            })
    
    # Print final results
    print(f"\n{'='*50}")
    print(f"📊 Final Results:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())