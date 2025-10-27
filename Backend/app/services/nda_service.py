import requests
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)

class NDAService:
    """Service to interact with NDA Data Dictionary API"""
    
    BASE_URL = "https://nda.nih.gov/api/datadictionary/v2"
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': 'application/json',
            'User-Agent': 'NeuroVerse/1.0'
        })
    
    def get_all_data_structures(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get list of all data structures from NDA"""
        endpoint = f"{self.BASE_URL}/datastructure"
        params = {"pageSize": limit}
        
        try:
            logger.info(f"Fetching data structures from NDA (limit: {limit})")
            response = self.session.get(endpoint, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            logger.info(f"Successfully fetched {len(data) if isinstance(data, list) else 0} data structures")
            return data if isinstance(data, list) else []
        except Exception as e:
            logger.error(f"Error fetching data structures: {e}")
            return []
    
    def get_data_structure_details(self, short_name: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific data structure"""
        endpoint = f"{self.BASE_URL}/datastructure/{short_name}"
        
        try:
            logger.info(f"Fetching details for data structure: {short_name}")
            response = self.session.get(endpoint, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            # Log what we got
            logger.info(f"NDA API returned for {short_name}: title={data.get('title')}, has_description={bool(data.get('description'))}")
            
            return data
        except Exception as e:
            logger.error(f"Error fetching data structure {short_name}: {e}")
            return None
    
    def parse_demographics(self, structure_data: Dict[str, Any], actual_participant_count: int = None) -> Dict[str, Any]:
        """Parse demographic information from NDA data structure - ONLY REAL DATA"""
        
        # Return minimal structure with no fake data
        demographics = {
            "total_participants": actual_participant_count or 0,
            "age_stats": None,
            "sex": [],
            "diagnosis": [],
            "age_distribution": [],
            "available_stats": [],
            "confidence": "unavailable"
        }
        
        if not structure_data or 'dataElements' not in structure_data:
            logger.info("No data elements found - returning empty demographics")
            return demographics
        
        data_elements = structure_data.get('dataElements', [])
        
        # Only check what fields exist, don't generate fake data
        has_age = any('age' in el.get('elementName', '').lower() for el in data_elements)
        has_sex = any('sex' in el.get('elementName', '').lower() or 'gender' in el.get('elementName', '').lower() for el in data_elements)
        has_diagnosis = any('diagnosis' in el.get('elementName', '').lower() or 'condition' in el.get('elementName', '').lower() for el in data_elements)
        
        available = []
        if has_age:
            available.append('age')
        if has_sex:
            available.append('sex')
        if has_diagnosis:
            available.append('diagnosis')
        
        demographics['available_stats'] = available
        
        logger.info(f"NDA structure has these fields: age={has_age}, sex={has_sex}, diagnosis={has_diagnosis}")
        logger.info(f"No actual participant data available - NDA Data Dictionary only contains metadata schemas")
        
        return demographics

nda_service = NDAService()
