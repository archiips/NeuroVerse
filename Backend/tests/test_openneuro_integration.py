"""
Test suite for OpenNeuro integration
Run with: pytest tests/test_openneuro_integration.py -v
"""

import pytest
from services.openneuro_parser import OpenNeuroParser
import pandas as pd

class TestOpenNeuroParser:
    """Test OpenNeuroParser functionality"""
    
    @pytest.fixture
    def sample_df(self):
        """Create sample participants.tsv data"""
        return pd.DataFrame({
            'participant_id': ['sub-01', 'sub-02', 'sub-03', 'sub-04'],
            'age': [25, 30, 35, 40],
            'sex': ['M', 'F', 'M', 'F'],
            'diagnosis': ['ADHD', 'Healthy', 'ADHD', 'Healthy']
        })
    
    def test_find_column_case_insensitive(self, sample_df):
        """Test column finding with different cases"""
        parser = OpenNeuroParser()
        
        # Should find 'age' column
        age_col = parser.find_column(sample_df, ['Age', 'AGE', 'age'])
        assert age_col == 'age'
        
        # Should find 'sex' column
        sex_col = parser.find_column(sample_df, ['Sex', 'SEX', 'sex', 'gender'])
        assert sex_col == 'sex'
    
    def test_clean_age_data(self, sample_df):
        """Test age data cleaning"""
        parser = OpenNeuroParser()
        
        # Add some invalid ages
        test_df = sample_df.copy()
        test_df.loc[4] = ['sub-05', -5, 'M', 'Healthy']  # Invalid negative
        test_df.loc[5] = ['sub-06', 150, 'F', 'ADHD']    # Invalid too old
        
        cleaned = parser.clean_age_data(test_df['age'])
        
        # Should only keep valid ages (25, 30, 35, 40)
        assert len(cleaned) == 4
        assert cleaned.min() >= 0
        assert cleaned.max() <= 120
    
    def test_normalize_sex_labels(self, sample_df):
        """Test sex label normalization"""
        parser = OpenNeuroParser()
        
        # Test various formats
        test_series = pd.Series(['M', 'F', 'Male', 'Female', '1', '2', 'm', 'f'])
        normalized = parser.normalize_sex_labels(test_series)
        
        # Should all be 'Male' or 'Female'
        assert set(normalized.unique()) <= {'Male', 'Female'}
    
    def test_calculate_distribution(self, sample_df):
        """Test distribution calculation"""
        parser = OpenNeuroParser()
        
        distribution = parser.calculate_distribution(sample_df['diagnosis'], 4)
        
        # Should have 2 categories
        assert len(distribution) == 2
        
        # Check structure
        assert all('label' in item for item in distribution)
        assert all('count' in item for item in distribution)
        assert all('percentage' in item for item in distribution)
        
        # Percentages should sum to 100
        total_pct = sum(float(item['percentage']) for item in distribution)
        assert 99 <= total_pct <= 101  # Allow for rounding
    
    def test_process_participants_data_complete(self, sample_df):
        """Test processing with complete data"""
        parser = OpenNeuroParser()
        
        result = parser.process_participants_data(sample_df)
        
        # Should have all fields
        assert result['total_participants'] == 4
        assert result['data_quality'] == 'complete'
        assert result['confidence'] == 'high'
        assert set(result['available_stats']) == {'age', 'sex', 'diagnosis'}
        
        # Should have all stats
        assert result['age_stats'] is not None
        assert result['sex'] is not None
        assert result['diagnosis'] is not None
    
    def test_process_participants_data_partial(self):
        """Test processing with partial data (no diagnosis)"""
        parser = OpenNeuroParser()
        
        partial_df = pd.DataFrame({
            'participant_id': ['sub-01', 'sub-02'],
            'age': [25, 30],
            'sex': ['M', 'F']
        })
        
        result = parser.process_participants_data(partial_df)
        
        # Should be marked as partial
        assert result['data_quality'] == 'partial'
        assert 'age' in result['available_stats']
        assert 'sex' in result['available_stats']
        assert 'diagnosis' not in result['available_stats']
        assert result['diagnosis'] is None


class TestFeaturedDatasets:
    """Test featured datasets configuration"""
    
    def test_featured_datasets_exist(self):
        """Test that featured datasets config exists"""
        from config.featured_datasets import FEATURED_DATASETS, get_featured_dataset, is_featured
        
        assert len(FEATURED_DATASETS) > 0
        assert all('openneuro_id' in ds for ds in FEATURED_DATASETS)
    
    def test_get_featured_dataset(self):
        """Test getting specific featured dataset"""
        from config.featured_datasets import get_featured_dataset
        
        # Test with known featured dataset
        ds = get_featured_dataset('ds000030')
        
        if ds:  # Only if this dataset is in featured list
            assert ds['openneuro_id'] == 'ds000030'
            assert 'name' in ds
            assert 'participant_count' in ds
    
    def test_is_featured_check(self):
        """Test featured status checking"""
        from config.featured_datasets import is_featured, FEATURED_DATASETS
        
        if len(FEATURED_DATASETS) > 0:
            first_featured = FEATURED_DATASETS[0]['openneuro_id']
            assert is_featured(first_featured) is True
            assert is_featured('ds999999') is False


class TestEndpoints:
    """Test API endpoints (requires running server)"""
    
    @pytest.fixture
    def client(self):
        """Create test client"""
        from app import app
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client
    
    def test_get_featured_datasets_endpoint(self, client):
        """Test GET /api/datasets/featured"""
        response = client.get('/api/datasets/featured')
        
        assert response.status_code == 200
        data = response.get_json()
        
        assert data['success'] is True
        assert 'data' in data
        assert isinstance(data['data'], list)
    
    def test_get_dataset_by_id(self, client):
        """Test GET /api/datasets/:id"""
        # Use a known dataset ID from your database
        response = client.get('/api/datasets/ds000030')
        
        assert response.status_code in [200, 404]  # 404 if not in DB yet
        
        if response.status_code == 200:
            data = response.get_json()
            assert data['success'] is True
            assert 'dataQuality' in data['data']
            assert 'availableStats' in data['data']
    
    def test_get_summary_stats(self, client):
        """Test GET /api/datasets/:id/summary-stats"""
        response = client.get('/api/datasets/ds000030/summary-stats')
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            data = response.get_json()
            assert data['success'] is True
            assert 'total_participants' in data['data']
            assert 'confidence' in data['data']
            assert 'available_stats' in data['data']


# Run with: pytest tests/test_openneuro_integration.py -v
