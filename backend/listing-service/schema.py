from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geography
from database import Base
import uuid
import datetime

class Listing(Base):
    __tablename__ = "listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    host_id = Column(UUID(as_uuid=True), nullable=True) # References users(id) in microservice architecture
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    price_per_night = Column(Float, nullable=False)
    
    # Spatial column for PostGIS radius searches
    geo_location = Column(Geography('POINT', srid=4326), nullable=False)
    
    # What3Words
    address_w3w = Column(String(100), nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
