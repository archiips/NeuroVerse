"""
OpenNeuro participants.tsv parser
Fetches and parses demographic data from OpenNeuro datasets
"""

import requests
import pandas as pd
from io import StringIO
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class OpenNeuroParser:
    """Parser for OpenNeuro participants.tsv files"""
    
    BASE_URL = "https://openneuro.org/crn/datasets"
    
    # Column name variations to check
    AGE_COLUMNS = ['age', 'Age', 'AGE', 'age_years', 'Age_years']
    SEX_COLUMNS = ['sex', 'Sex', 'SEX', 'gender', 'Gender', 'GENDER']
    DIAGNOSIS_COLUMNS = ['diagnosis', 'Diagnosis', 'DIAGNOSIS', 'group', 'Group', 'GROUP', 'condition', 'Condition']
    
    @staticmethod
    def fetch_participants_tsv(dataset_id: str) -> Optional[pd.DataFrame]:
        """
        Fetch participants.tsv from OpenNeuro
        
        Args:
            dataset_id: OpenNeuro dataset ID (e.g., 'ds000030')
            
        Returns:
            DataFrame or None if not available
        """
        url = f"{OpenNeuroParser.BASE_URL}/{dataset_id}/files/participants.tsv"
        
        try:
            logger.info(f"Fetching participants.tsv from {url}")
            response = requests.get(url, timeout=15)
            
            if response.status_code == 200:
                # Parse TSV
                df = pd.read_csv(StringIO(response.text), sep='\t')
                logger.info(f"Successfully parsed {len(df)} participants from {dataset_id}")
                return df
            else:
                logger.warning(f"Failed to fetch participants.tsv for {dataset_id}: HTTP {response.status_code}")
                return None
                
        except requests.Timeout:
            logger.error(f"Timeout fetching participants.tsv for {dataset_id}")
            return None
        except Exception as e:
            logger.error(f"Error fetching participants.tsv for {dataset_id}: {str(e)}")
            return None
    
    @staticmethod
    def find_column(df: pd.DataFrame, possible_names: List[str]) -> Optional[str]:
        """Find a column by checking multiple possible names"""
        for col_name in possible_names:
            if col_name in df.columns:
                return col_name
        return None
    
    @staticmethod
    def clean_age_data(age_series: pd.Series) -> pd.Series:
        """Clean age data - convert to numeric and filter valid range"""
        # Convert to numeric
        ages = pd.to_numeric(age_series, errors='coerce')
        
        # Filter realistic age range (0-120)
        ages = ages[(ages >= 0) & (ages <= 120)]
        
        # Remove NaN
        ages = ages.dropna()
        
        return ages
    
    @staticmethod
    def normalize_sex_labels(sex_series: pd.Series) -> pd.Series:
        """Normalize sex/gender labels to standard format"""
        mapping = {
            'M': 'Male', 'm': 'Male', 'MALE': 'Male', 'male': 'Male', '1': 'Male',
            'F': 'Female', 'f': 'Female', 'FEMALE': 'Female', 'female': 'Female', '2': 'Female'
        }
        
        return sex_series.map(mapping).fillna(sex_series)
    
    @staticmethod
    def calculate_distribution(series: pd.Series, total_count: int) -> List[Dict]:
        """Calculate distribution for categorical data"""
        value_counts = series.value_counts()
        
        distribution = []
        for label, count in value_counts.items():
            percentage = (count / total_count * 100) if total_count > 0 else 0
            distribution.append({
                'label': str(label),
                'count': int(count),
                'percentage': f"{percentage:.1f}"
            })
        
        return distribution
    
    @staticmethod
    def calculate_age_distribution(ages: pd.Series, total_count: int) -> List[Dict]:
        """Calculate age distribution by bins"""
        bins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        labels = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100']
        
        age_bins = pd.cut(ages, bins=bins, labels=labels, include_lowest=True)
        bin_counts = age_bins.value_counts().sort_index()
        
        distribution = []
        for bin_label, count in bin_counts.items():
            if count > 0:
                distribution.append({
                    'bin': str(bin_label),
                    'count': int(count)
                })
        
        return distribution
    
    @staticmethod
    def process_participants_data(df: pd.DataFrame) -> Dict:
        """
        Main processing function - extract all available statistics
        
        Returns:
            Dictionary with statistics and quality indicators
        """
        total_participants = len(df)
        available_stats = []
        result = {
            'total_participants': total_participants,
            'confidence': 'unavailable',
            'available_stats': [],
            'data_quality': 'minimal',
            'age_stats': None,
            'diagnosis': None,
            'sex': None,
            'age_distribution': None
        }
        
        # Process AGE
        age_col = OpenNeuroParser.find_column(df, OpenNeuroParser.AGE_COLUMNS)
        if age_col:
            ages = OpenNeuroParser.clean_age_data(df[age_col])
            if len(ages) > 0:
                available_stats.append('age')
                result['age_stats'] = {
                    'mean': float(ages.mean()),
                    'median': float(ages.median()),
                    'std': float(ages.std()),
                    'min': float(ages.min()),
                    'max': float(ages.max())
                }
                result['age_distribution'] = OpenNeuroParser.calculate_age_distribution(ages, total_participants)
        
        # Process SEX
        sex_col = OpenNeuroParser.find_column(df, OpenNeuroParser.SEX_COLUMNS)
        if sex_col:
            sex_data = OpenNeuroParser.normalize_sex_labels(df[sex_col].dropna())
            if len(sex_data) > 0:
                available_stats.append('sex')
                result['sex'] = OpenNeuroParser.calculate_distribution(sex_data, total_participants)
        
        # Process DIAGNOSIS
        diagnosis_col = OpenNeuroParser.find_column(df, OpenNeuroParser.DIAGNOSIS_COLUMNS)
        if diagnosis_col:
            diagnosis_data = df[diagnosis_col].dropna()
            if len(diagnosis_data) > 0:
                available_stats.append('diagnosis')
                result['diagnosis'] = OpenNeuroParser.calculate_distribution(diagnosis_data, total_participants)
        
        # Assess data quality
        result['available_stats'] = available_stats
        
        if len(available_stats) >= 3:
            result['data_quality'] = 'complete'
            result['confidence'] = 'high'
        elif len(available_stats) >= 1:
            result['data_quality'] = 'partial'
            result['confidence'] = 'high' if len(available_stats) >= 2 else 'estimated'
        else:
            result['data_quality'] = 'minimal'
            result['confidence'] = 'unavailable'
        
        return result
