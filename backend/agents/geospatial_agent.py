import json
from typing import Dict, Any, List, Optional

class GeospatialAgent:
    """
    Connects municipal policy notices with geographic coordinates,
    BBMP ward boundaries, zoning overlays, and transit/environmental impact zones.
    """

    # Realistic GeoJSON coordinates for major Bengaluru municipal wards
    BENGALURU_WARDS = [
        {
            "ward_number": 80,
            "name": "Indiranagar (Shanthi Nagar / Hoysala Nagar)",
            "zone": "East",
            "city": "Bengaluru",
            "pin_codes": "560038, 560008",
            "population": 62000,
            "area_sq_km": 4.2,
            "center": [12.9784, 77.6408],
            "polygon": [
                [12.970, 77.632], [12.986, 77.633], [12.988, 77.652], [12.972, 77.650], [12.970, 77.632]
            ]
        },
        {
            "ward_number": 151,
            "name": "Koramangala (Koramangala 1st to 8th Block)",
            "zone": "South",
            "city": "Bengaluru",
            "pin_codes": "560034, 560095",
            "population": 78000,
            "area_sq_km": 5.1,
            "center": [12.9352, 77.6245],
            "polygon": [
                [12.925, 77.615], [12.945, 77.616], [12.946, 77.638], [12.926, 77.636], [12.925, 77.615]
            ]
        },
        {
            "ward_number": 174,
            "name": "HSR Layout (Sector 1 to 7)",
            "zone": "Bommanahalli",
            "city": "Bengaluru",
            "pin_codes": "560102",
            "population": 85000,
            "area_sq_km": 6.8,
            "center": [12.9121, 77.6446],
            "polygon": [
                [12.902, 77.632], [12.922, 77.634], [12.924, 77.658], [12.903, 77.656], [12.902, 77.632]
            ]
        },
        {
            "ward_number": 84,
            "name": "Whitefield (Kadugodi / ITPL Hub)",
            "zone": "Mahadevapura",
            "city": "Bengaluru",
            "pin_codes": "560066",
            "population": 115000,
            "area_sq_km": 12.4,
            "center": [12.9698, 77.7500],
            "polygon": [
                [12.955, 77.735], [12.985, 77.736], [12.986, 77.768], [12.956, 77.765], [12.955, 77.735]
            ]
        },
        {
            "ward_number": 45,
            "name": "Malleshwaram",
            "zone": "West",
            "city": "Bengaluru",
            "pin_codes": "560003",
            "population": 54000,
            "area_sq_km": 3.8,
            "center": [13.0031, 77.5643],
            "polygon": [
                [12.993, 77.555], [13.014, 77.556], [13.015, 77.575], [12.994, 77.573], [12.993, 77.555]
            ]
        },
        {
            "ward_number": 168,
            "name": "Jayanagar (4th T Block & South End)",
            "zone": "South",
            "city": "Bengaluru",
            "pin_codes": "560011, 560041",
            "population": 69000,
            "area_sq_km": 4.6,
            "center": [12.9308, 77.5838],
            "polygon": [
                [12.920, 77.573], [12.940, 77.574], [12.941, 77.595], [12.921, 77.593], [12.920, 77.573]
            ]
        }
    ]

    @classmethod
    def get_geojson_feature_collection(cls) -> Dict[str, Any]:
        features = []
        for ward in cls.BENGALURU_WARDS:
            # Leaflet expects [lat, lng] for points, but GeoJSON standard is [lng, lat]
            # Convert polygon coords to GeoJSON standard [lng, lat]
            geojson_coords = [[pt[1], pt[0]] for pt in ward["polygon"]]
            feature = {
                "type": "Feature",
                "properties": {
                    "ward_number": ward["ward_number"],
                    "name": ward["name"],
                    "zone": ward["zone"],
                    "city": ward["city"],
                    "population": ward["population"],
                    "area_sq_km": ward["area_sq_km"],
                    "pin_codes": ward["pin_codes"]
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [geojson_coords]
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

    @classmethod
    def find_ward_by_name_or_pincode(cls, query: str) -> Optional[Dict[str, Any]]:
        query_clean = query.strip().lower()
        for ward in cls.BENGALURU_WARDS:
            if query_clean in ward["name"].lower() or query_clean in ward["pin_codes"].lower() or query_clean in str(ward["ward_number"]):
                return ward
        return None
