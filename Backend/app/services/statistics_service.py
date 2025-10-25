"""Service for calculating dataset statistics"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from collections import OrderedDict

from app.models.participant import Participant
from app.schemas.statistics import CategoryCount, AgeBin, SummaryStatistics


class StatisticsService:
    """Service for calculating dataset statistics"""

    def __init__(self, db: Session):
        self.db = db

    def count_by_diagnosis(self, dataset_id: int) -> List[CategoryCount]:
        """
        Count subjects by diagnosis category

        Args:
            dataset_id: ID of the dataset

        Returns:
            List of diagnosis counts with percentages
        """
        # Get total count first
        total = (
            self.db.query(func.count(Participant.id))
            .filter(Participant.dataset_id == dataset_id)
            .scalar()
        ) or 1  # Avoid division by zero

        results = (
            self.db.query(
                Participant.diagnosis.label('diagnosis'),
                func.count(Participant.id).label('count')
            )
            .filter(Participant.dataset_id == dataset_id)
            .group_by(Participant.diagnosis)
            .all()
        )

        return [
            CategoryCount(
                label=row.diagnosis if row.diagnosis else "Unknown",
                count=row.count,
                percentage=round((row.count / total) * 100, 1)
            )
            for row in results
        ]

    def count_by_sex(self, dataset_id: int) -> List[CategoryCount]:
        """
        Count subjects by sex category

        Args:
            dataset_id: ID of the dataset

        Returns:
            List of sex counts with percentages
        """
        # Get total count first
        total = (
            self.db.query(func.count(Participant.id))
            .filter(Participant.dataset_id == dataset_id)
            .scalar()
        ) or 1  # Avoid division by zero

        results = (
            self.db.query(
                Participant.sex.label('sex'),
                func.count(Participant.id).label('count')
            )
            .filter(
                Participant.dataset_id == dataset_id,
                Participant.sex.isnot(None)  # Exclude null sex values
            )
            .group_by(Participant.sex)
            .all()
        )

        # Recalculate total excluding nulls for accurate percentages
        total_with_sex = sum(row.count for row in results) or 1

        return [
            CategoryCount(
                label=row.sex,
                count=row.count,
                percentage=round((row.count / total_with_sex) * 100, 1)
            )
            for row in results
        ]

    def get_age_distribution(self, dataset_id: int) -> List[AgeBin]:
        """
        Get age distribution with binning

        Args:
            dataset_id: ID of the dataset

        Returns:
            List of age bins with counts
        """
        # Fetch all ages for the dataset
        ages = (
            self.db.query(Participant.age)
            .filter(Participant.dataset_id == dataset_id)
            .filter(Participant.age.isnot(None))
            .all()
        )

        # Define age bins (using OrderedDict to maintain order)
        age_bins = OrderedDict([
            ("18-25", 0),
            ("26-35", 0),
            ("36-45", 0),
            ("46-55", 0),
            ("56+", 0)
        ])

        # Count subjects in each bin
        for (age,) in ages:
            if 18 <= age <= 25:
                age_bins["18-25"] += 1
            elif 26 <= age <= 35:
                age_bins["26-35"] += 1
            elif 36 <= age <= 45:
                age_bins["36-45"] += 1
            elif 46 <= age <= 55:
                age_bins["46-55"] += 1
            elif age >= 56:
                age_bins["56+"] += 1

        return [
            AgeBin(bin=bin_name, count=count)
            for bin_name, count in age_bins.items()
        ]

    def get_age_statistics(self, dataset_id: int):
        """Calculate age statistics (mean, median, min, max)"""
        from app.schemas.statistics import AgeStats

        ages = (
            self.db.query(Participant.age)
            .filter(Participant.dataset_id == dataset_id)
            .filter(Participant.age.isnot(None))
            .all()
        )

        age_values = [age[0] for age in ages if age[0] is not None]

        if not age_values:
            return None

        sorted_ages = sorted(age_values)
        n = len(age_values)

        # Calculate median
        if n % 2 == 0:
            median = (sorted_ages[n//2 - 1] + sorted_ages[n//2]) / 2
        else:
            median = sorted_ages[n//2]

        return AgeStats(
            mean=round(sum(age_values) / len(age_values), 1),
            median=round(median, 1),
            min=round(min(age_values), 1),
            max=round(max(age_values), 1)
        )

    def get_summary_statistics(self, dataset_id: int) -> SummaryStatistics:
        """
        Get complete summary statistics for a dataset

        Args:
            dataset_id: ID of the dataset

        Returns:
            Complete summary statistics
        """
        # Get total count
        total_count = (
            self.db.query(func.count(Participant.id))
            .filter(Participant.dataset_id == dataset_id)
            .scalar()
        )

        return SummaryStatistics(
            total_participants=total_count or 0,
            total_subjects=total_count or 0,
            diagnosis=self.count_by_diagnosis(dataset_id),
            sex=self.count_by_sex(dataset_id),
            age_distribution=self.get_age_distribution(dataset_id),
            age_stats=self.get_age_statistics(dataset_id)
        )
