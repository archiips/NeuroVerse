import requests
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class NDAService:
    BASE_URL = "https://nda.nih.gov/api/datadictionary/v2"
    
    def __init__(self):
        self.session = requests.Session()
        
    def get_data_structures(self, short_name: str = None) -> List[Dict]:
        """Get list of data structures from NDA"""
        endpoint = f"{self.BASE_URL}/datastructure"
        params = {"shortName": short_name} if short_name else {}
        
        try:
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching data structures: {e}")
            return []
    
    def get_data_elements(self, structure_id: str) -> Dict:
        """Get data elements for a specific structure"""
        endpoint = f"{self.BASE_URL}/datastructure/{structure_id}"
        
        try:
            response = self.session.get(endpoint)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching data elements: {e}")
            return {}
