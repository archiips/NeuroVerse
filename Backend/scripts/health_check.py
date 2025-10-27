"""
System health check and validation tool
Run with: python scripts/health_check.py
"""

from app import app, db
from models.dataset import Dataset
from services.openneuro_parser import OpenNeuroParser
from config.featured_datasets import FEATURED_DATASETS, is_featured
import requests
from datetime import datetime, timedelta
from termcolor import colored
import sys


class HealthChecker:
    """System health validation"""
    
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.warnings = 0
    
    def check(self, name, condition, error_msg=""):
        """Run a single health check"""
        if condition:
            print(colored(f"✓ {name}", "green"))
            self.passed += 1
            return True
        else:
            print(colored(f"✗ {name}", "red"))
            if error_msg:
                print(colored(f"  → {error_msg}", "red"))
            self.failed += 1
            return False
    
    def warn(self, name, message):
        """Issue a warning"""
        print(colored(f"⚠ {name}", "yellow"))
        print(colored(f"  → {message}", "yellow"))
        self.warnings += 1
    
    def print_summary(self):
        """Print summary of checks"""
        total = self.passed + self.failed
        print("\n" + "="*50)
        print(colored(f"Health Check Summary:", "cyan", attrs=["bold"]))
        print(colored(f"  Passed: {self.passed}/{total}", "green"))
        print(colored(f"  Failed: {self.failed}/{total}", "red"))
        print(colored(f"  Warnings: {self.warnings}", "yellow"))
        print("="*50 + "\n")
        
        if self.failed > 0:
            sys.exit(1)


def check_database_connection():
    """Check database connectivity"""
    checker = HealthChecker()
    
    print(colored("\n📊 Database Checks:", "cyan", attrs=["bold"]))
    
    with app.app_context():
        try:
            # Test connection
            db.session.execute('SELECT 1')
            checker.check("Database connection", True)
            
            # Check tables exist
            tables = db.engine.table_names()
            checker.check("Dataset table exists", 'dataset' in tables or 'datasets' in tables)
            
            # Check dataset count
            count = Dataset.query.count()
            checker.check(f"Datasets in database ({count} total)", count > 0,
                         "No datasets found. Run seed script first.")
            
            # Check for featured datasets
            featured_count = Dataset.query.filter_by(is_featured=True).count()
            if featured_count > 0:
                checker.check(f"Featured datasets ({featured_count} total)", True)
            else:
                checker.warn("Featured datasets", 
                           "No featured datasets in database")
            
        except Exception as e:
            checker.check("Database connection", False, str(e))
    
    checker.print_summary()


def check_openneuro_connectivity():
    """Check OpenNeuro API connectivity"""
    checker = HealthChecker()
    
    print(colored("\n🌐 OpenNeuro Connectivity:", "cyan", attrs=["bold"]))
    
    # Test OpenNeuro API
    test_url = "https://openneuro.org/crn/datasets/ds000030/files/participants.tsv"
    
    try:
        response = requests.head(test_url, timeout=10)
        checker.check("OpenNeuro API reachable", response.status_code in [200, 302])
    except requests.Timeout:
        checker.check("OpenNeuro API reachable", False, "Connection timeout")
    except requests.RequestException as e:
        checker.check("OpenNeuro API reachable", False, str(e))
    
    # Test parser
    try:
        df = OpenNeuroParser.fetch_participants_tsv('ds000030')
        checker.check("TSV parser working", df is not None and len(df) > 0)
    except Exception as e:
        checker.check("TSV parser working", False, str(e))
    
    checker.print_summary()


def check_data_quality():
    """Check data quality metrics"""
    checker = HealthChecker()
    
    print(colored("\n📈 Data Quality Checks:", "cyan", attrs=["bold"]))
    
    with app.app_context():
        datasets = Dataset.query.all()
        
        if len(datasets) == 0:
            checker.warn("No datasets", "Database is empty")
            checker.print_summary()
            return
        
        # Count by quality
        complete_count = sum(1 for d in datasets if d.data_quality == 'complete')
        partial_count = sum(1 for d in datasets if d.data_quality == 'partial')
        minimal_count = sum(1 for d in datasets if d.data_quality == 'minimal')
        
        print(f"\n  Distribution:")
        print(f"  - Complete: {complete_count}")
        print(f"  - Partial:  {partial_count}")
        print(f"  - Minimal:  {minimal_count}")
        
        # Check if we have at least some complete datasets
        checker.check("At least 1 complete dataset", complete_count > 0,
                     "No complete datasets available")
        
        # Check for stale data (not updated in 30 days)
        stale_threshold = datetime.now() - timedelta(days=30)
        stale_datasets = [d for d in datasets 
                         if hasattr(d, 'updated_at') and d.updated_at < stale_threshold]
        
        if len(stale_datasets) > 0:
            checker.warn(f"Stale data ({len(stale_datasets)} datasets)", 
                        "Some datasets haven't been updated in 30+ days")
        else:
            checker.check("Data freshness", True)
        
        # Check confidence levels
        high_confidence = sum(1 for d in datasets if d.confidence == 'high')
        print(f"\n  Confidence:")
        print(f"  - High: {high_confidence}/{len(datasets)}")
        
        checker.check("Majority high confidence", 
                     high_confidence > len(datasets) / 2)
    
    checker.print_summary()


def check_endpoints():
    """Check API endpoints (requires running server)"""
    checker = HealthChecker()
    
    print(colored("\n🔌 API Endpoint Checks:", "cyan", attrs=["bold"]))
    print(colored("  (Server must be running)", "yellow"))
    
    base_url = "http://localhost:5000/api"
    
    # Test featured datasets endpoint
    try:
        response = requests.get(f"{base_url}/datasets/featured", timeout=5)
        checker.check("GET /api/datasets/featured", response.status_code == 200)
    except requests.RequestException:
        checker.warn("GET /api/datasets/featured", "Server not running or endpoint unavailable")
    
    # Test dataset by ID endpoint
    try:
        response = requests.get(f"{base_url}/datasets/ds000030", timeout=5)
        checker.check("GET /api/datasets/:id", response.status_code in [200, 404])
    except requests.RequestException:
        checker.warn("GET /api/datasets/:id", "Server not running or endpoint unavailable")
    
    # Test summary stats endpoint
    try:
        response = requests.get(f"{base_url}/datasets/ds000030/summary-stats", timeout=5)
        checker.check("GET /api/datasets/:id/summary-stats", response.status_code in [200, 404])
    except requests.RequestException:
        checker.warn("GET /api/datasets/:id/summary-stats", "Server not running or endpoint unavailable")
    
    checker.print_summary()


def run_all_checks():
    """Run all health checks"""
    print(colored("\n" + "="*50, "cyan"))
    print(colored("🏥 NEUROVERSE SYSTEM HEALTH CHECK", "cyan", attrs=["bold"]))
    print(colored("="*50, "cyan"))
    
    check_database_connection()
    check_openneuro_connectivity()
    check_data_quality()
    check_endpoints()
    
    print(colored("\n✅ All checks complete!", "green", attrs=["bold"]))


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='System health check')
    parser.add_argument('--database', action='store_true', help='Check database only')
    parser.add_argument('--openneuro', action='store_true', help='Check OpenNeuro only')
    parser.add_argument('--quality', action='store_true', help='Check data quality only')
    parser.add_argument('--endpoints', action='store_true', help='Check API endpoints only')
    
    args = parser.parse_args()
    
    if args.database:
        check_database_connection()
    elif args.openneuro:
        check_openneuro_connectivity()
    elif args.quality:
        check_data_quality()
    elif args.endpoints:
        check_endpoints()
    else:
        run_all_checks()
