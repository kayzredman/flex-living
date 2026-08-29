from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
import uuid

from database import engine, Base, get_db
from schema import Listing

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Flex-Living Listing Service")

# Pydantic Schemas
class ListingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price_per_night: float
    lat: float
    lng: float
    address_w3w: Optional[str] = None
    host_id: Optional[str] = None

class ListingResponse(BaseModel):
    id: str
    title: str
    price_per_night: float
    distance_km: Optional[float] = None
    address_w3w: Optional[str] = None

    class Config:
        from_attributes = True

# Helper: Mock W3W Resolver
def resolve_w3w_mock(w3w_address: str) -> tuple[float, float]:
    """Mocks resolving a what3words address to lat/lng"""
    # Just hardcoding a mock for demonstration
    if "accra" in w3w_address.lower():
        return 5.6037, -0.1870
    return 0.0, 0.0

@app.get("/health")
def health_check():
    return {"status": "OK", "service": "listing-catalog"}

@app.post("/v1/listings", response_model=dict)
def create_listing(listing: ListingCreate, db: Session = Depends(get_db)):
    # Create the Point geometry string "POINT(lon lat)"
    # Note: PostGIS expects longitude first, then latitude
    point_str = f"POINT({listing.lng} {listing.lat})"
    
    new_listing = Listing(
        host_id=uuid.UUID(listing.host_id) if listing.host_id else None,
        title=listing.title,
        description=listing.description,
        price_per_night=listing.price_per_night,
        geo_location=point_str,
        address_w3w=listing.address_w3w
    )
    
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    
    return {"status": "success", "listing_id": str(new_listing.id)}

@app.get("/v1/listings", response_model=List[ListingResponse])
def search_listings(
    lat: float, 
    lng: float, 
    radius_km: float = 10.0,
    db: Session = Depends(get_db)
):
    """
    Find listings within a given radius using PostGIS ST_DWithin.
    Returns listings sorted by distance.
    """
    search_point = f"POINT({lng} {lat})"
    
    # Distance in meters
    radius_meters = radius_km * 1000.0

    # ST_DWithin checks if geography objects are within distance
    # ST_Distance calculates the exact distance
    query = db.query(
        Listing,
        func.ST_Distance(Listing.geo_location, search_point).label('distance')
    ).filter(
        func.ST_DWithin(Listing.geo_location, search_point, radius_meters)
    ).order_by('distance').all()

    results = []
    for listing, distance_meters in query:
        results.append(ListingResponse(
            id=str(listing.id),
            title=listing.title,
            price_per_night=listing.price_per_night,
            distance_km=round(distance_meters / 1000.0, 2),
            address_w3w=listing.address_w3w
        ))
        
    return results

# If running directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
