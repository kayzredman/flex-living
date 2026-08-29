import httpx
import asyncio

BASE_URL = "http://localhost:8000"

async def run_qa():
    print("🧪 Starting QA Certification for Listing Catalog (Spatial Queries)...")
    passed = 0
    failed = 0

    def assert_test(condition, message):
        nonlocal passed, failed
        if condition:
            print(f"✅ PASS: {message}")
            passed += 1
        else:
            print(f"❌ FAIL: {message}")
            failed += 1

    async with httpx.AsyncClient() as client:
        # Test 1: Health check
        res = await client.get(f"{BASE_URL}/health")
        assert_test(res.status_code == 200 and res.json()["status"] == "OK", "Health check returns 200 OK")

        # Test 2: Seed Mock Properties
        # Accra Center (Lat: 5.6037, Lng: -0.1870)
        p1 = await client.post(f"{BASE_URL}/v1/listings", json={
            "title": "Accra Luxury Apartment",
            "price_per_night": 150.0,
            "lat": 5.6037,
            "lng": -0.1870,
            "address_w3w": "///accra.luxury.stay"
        })
        
        # Lagos (Lat: 6.5244, Lng: 3.3792) - Far away
        p2 = await client.post(f"{BASE_URL}/v1/listings", json={
            "title": "Lagos Studio",
            "price_per_night": 80.0,
            "lat": 6.5244,
            "lng": 3.3792
        })
        
        # Osu, Accra (Lat: 5.5560, Lng: -0.1869) - About 5km from Accra Center
        p3 = await client.post(f"{BASE_URL}/v1/listings", json={
            "title": "Osu Nightlife Condo",
            "price_per_night": 120.0,
            "lat": 5.5560,
            "lng": -0.1869
        })
        
        assert_test(p1.status_code == 200 and p2.status_code == 200 and p3.status_code == 200, "Successfully seeded PostGIS data")

        # Test 3: Radius Search (5km from Accra Center)
        # Should only return Accra Luxury (0km) and maybe Osu Nightlife (~5.3km, let's use 6km radius)
        search = await client.get(f"{BASE_URL}/v1/listings", params={
            "lat": 5.6037,
            "lng": -0.1870,
            "radius_km": 6.0
        })
        
        assert_test(search.status_code == 200, "Spatial search endpoint works")
        data = search.json()
        
        # Verify Lagos is not in results
        in_results = any(item["title"] == "Lagos Studio" for item in data)
        assert_test(not in_results, "PostGIS successfully filters out properties outside the radius")
        
        # Verify sorting (Accra Luxury should be first with distance ~0, Osu second)
        assert_test(len(data) >= 2, f"Returned {len(data)} properties within 6km radius")
        if len(data) >= 2:
            assert_test(data[0]["distance_km"] < data[1]["distance_km"], "Properties are correctly sorted by spatial distance")

    print(f"\n📊 QA Summary: {passed} Passed, {failed} Failed")
    if failed == 0:
        print("🏆 QA CERTIFICATION: APPROVED.")
    else:
        print("🚨 QA CERTIFICATION: REJECTED.")

if __name__ == "__main__":
    asyncio.run(run_qa())
