"""OpenNeuro API client service"""
import requests
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)


class OpenNeuroService:
    """Service to interact with OpenNeuro GraphQL API - REAL DATA ONLY"""
    
    GRAPHQL_URL = "https://openneuro.org/crn/graphql"
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
        })
    
    def _query(self, query: str, variables: Dict = None) -> Dict:
        """Execute GraphQL query"""
        try:
            response = self.session.post(
                self.GRAPHQL_URL,
                json={'query': query, 'variables': variables or {}},
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            
            if 'errors' in data:
                logger.error(f"GraphQL errors: {data['errors']}")
                return None
            
            return data.get('data')
        except Exception as e:
            logger.error(f"GraphQL query error: {e}")
            return None
    
    def get_all_datasets(self) -> List[Dict[str, Any]]:
        """Get all public datasets from OpenNeuro - using CORRECT format from docs"""
        # Correct query format from OpenNeuro documentation
        query = """
        {
          datasets {
            id
            latestSnapshot {
              tag
              description {
                Name
              }
              summary {
                subjects
                tasks
                modalities
              }
            }
          }
        }
        """
        
        try:
            logger.info("Querying OpenNeuro GraphQL API with correct format...")
            data = self._query(query)
            
            if not data or 'datasets' not in data:
                logger.error(f"No datasets in response. Data: {data}")
                return []
            
            datasets = []
            for ds in data['datasets']:
                try:
                    dataset_id = ds.get('id')
                    snapshot = ds.get('latestSnapshot')
                    
                    if not snapshot:
                        logger.warning(f"No snapshot for dataset {dataset_id}")
                        continue
                    
                    description = snapshot.get('description', {})
                    summary = snapshot.get('summary', {})
                    
                    datasets.append({
                        'id': dataset_id,
                        'name': description.get('Name', dataset_id),
                        'description': description.get('Name', 'OpenNeuro dataset'),
                        'subjects': summary.get('subjects', 0),
                        'tasks': len(summary.get('tasks', [])),
                        'modalities': summary.get('modalities', ['fMRI'])
                    })
                except Exception as e:
                    logger.warning(f"Error parsing dataset: {e}")
                    continue
            
            logger.info(f"Successfully parsed {len(datasets)} datasets from OpenNeuro")
            return datasets
            
        except Exception as e:
            logger.error(f"Error fetching datasets: {e}", exc_info=True)
            return []
    
    def get_participants_data(self, dataset_id: str) -> Optional[Dict[str, Any]]:
        """Get REAL participant demographics from participants.tsv file"""
        # Query to get file tree
        query = """
        query($datasetId: ID!) {
          dataset(id: $datasetId) {
            latestSnapshot {
              files {
                filename
                urls
              }
            }
          }
        }
        """
        
        try:
            logger.info(f"Fetching files for dataset: {dataset_id}")
            data = self._query(query, {'datasetId': dataset_id})
            
            if not data or 'dataset' not in data:
                logger.info(f"No dataset found for {dataset_id}")
                return None
            
            files = data['dataset'].get('latestSnapshot', {}).get('files', [])
            participants_file = next(
                (f for f in files if f.get('filename') == 'participants.tsv'), 
                None
            )
            
            if not participants_file or not participants_file.get('urls'):
                logger.info(f"No participants.tsv found for {dataset_id}")
                return None
            
            # Download and parse participants.tsv
            tsv_url = participants_file['urls'][0]
            logger.info(f"Downloading participants.tsv from: {tsv_url}")
            response = requests.get(tsv_url, timeout=30)
            response.raise_for_status()
            
            # Parse TSV content
            demographics = self._parse_participants_tsv(response.text)
            logger.info(f"Parsed REAL participant data for {dataset_id}: {demographics.get('total_participants')} subjects")
            
            return demographics
            
        except Exception as e:
            logger.error(f"Error fetching participants for {dataset_id}: {e}")
            return None
    
    def _parse_participants_tsv(self, tsv_content: str) -> Dict[str, Any]:
        """Parse participants.tsv file and extract REAL demographics - NO FAKE DATA"""
        lines = tsv_content.strip().split('\n')
        if len(lines) < 2:
            return {'total_participants': 0, 'available_stats': [], 'confidence': 'high'}
        
        # Parse header
        header = [h.strip() for h in lines[0].split('\t')]
        
        # Check what fields are available
        has_age = 'age' in header
        has_sex = 'sex' in header or 'gender' in header
        has_diagnosis = any('group' in h.lower() or 'diagnosis' in h.lower() for h in header)
        
        participants = []
        for line in lines[1:]:
            if not line.strip():
                continue
            values = line.split('\t')
            participant = {}
            for i, value in enumerate(values):
                if i < len(header):
                    participant[header[i]] = value.strip()
            participants.append(participant)
        
        demographics = {
            'total_participants': len(participants),
            'available_stats': [],
            'confidence': 'high'
        }
        
        # Process AGE
        if has_age:
            ages = []
            for p in participants:
                age_val = p.get('age', '').strip()
                if age_val and age_val not in ['n/a', 'N/A', '']:
                    try:
                        ages.append(float(age_val))
                    except ValueError:
                        pass
            
            if ages:
                demographics['available_stats'].append('age')
                demographics['age_stats'] = {
                    'mean': sum(ages) / len(ages),
                    'min': min(ages),
                    'max': max(ages)
                }
                
                bins = {'0-20': 0, '21-40': 0, '41-60': 0, '61+': 0}
                for age in ages:
                    if age <= 20:
                        bins['0-20'] += 1
                    elif age <= 40:
                        bins['21-40'] += 1
                    elif age <= 60:
                        bins['41-60'] += 1
                    else:
                        bins['61+'] += 1
                
                demographics['age_distribution'] = [
                    {'bin': k, 'count': v} for k, v in bins.items() if v > 0
                ]
        
        # Process SEX
        sex_col = 'sex' if 'sex' in header else ('gender' if 'gender' in header else None)
        if sex_col:
            sex_counts = {}
            for p in participants:
                sex_value = p.get(sex_col, '').strip().upper()
                if sex_value and sex_value not in ['N/A', 'NA', '']:
                    if sex_value in ['M', 'MALE']:
                        sex_value = 'Male'
                    elif sex_value in ['F', 'FEMALE']:
                        sex_value = 'Female'
                    sex_counts[sex_value] = sex_counts.get(sex_value, 0) + 1
            
            if sex_counts:
                demographics['available_stats'].append('sex')
                total = sum(sex_counts.values())
                # Sort by count descending so highest is first
                demographics['sex'] = sorted(
                    [
                        {
                            'label': k,
                            'count': v,
                            'percentage': str(round(v / total * 100, 1))
                        }
                        for k, v in sex_counts.items()
                    ],
                    key=lambda x: x['count'],
                    reverse=True
                )
        
        # Process GROUP/DIAGNOSIS
        diag_col = next((h for h in header if 'group' in h.lower() or 'diagnosis' in h.lower()), None)
        if diag_col:
            diag_counts = {}
            for p in participants:
                diag_value = p.get(diag_col, '').strip()
                if diag_value and diag_value.lower() not in ['n/a', 'na', '']:
                    diag_counts[diag_value] = diag_counts.get(diag_value, 0) + 1
            
            if diag_counts:
                demographics['available_stats'].append('diagnosis')
                total = sum(diag_counts.values())
                # Sort by count descending so highest is first
                demographics['diagnosis'] = sorted(
                    [
                        {
                            'label': k,
                            'count': v,
                            'percentage': str(round(v / total * 100, 1))
                        }
                        for k, v in diag_counts.items()
                    ],
                    key=lambda x: x['count'],
                    reverse=True
                )
        
        return demographics

openneuro_service = OpenNeuroService()
