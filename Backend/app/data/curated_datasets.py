"""
Curated list of popular OpenNeuro datasets for pre-loading.
These datasets are selected based on:
- Data completeness (have participants.tsv)
- Reasonable size (good for demos)
- Variety of modalities and research topics
"""

CURATED_DATASETS = [
    {
        "openneuro_id": "ds000224",
        "snapshot_tag": None,
        "description": "Midnight Scan Club - High-quality resting state fMRI",
        "priority": 1
    },
    {
        "openneuro_id": "ds000001",
        "snapshot_tag": None,
        "description": "Single Subject Task fMRI",
        "priority": 2
    },
    {
        "openneuro_id": "ds000102",
        "snapshot_tag": None,
        "description": "Flanker task (event-related fMRI)",
        "priority": 3
    },
    {
        "openneuro_id": "ds000105",
        "snapshot_tag": None,
        "description": "Visual object recognition",
        "priority": 4
    },
    {
        "openneuro_id": "ds000113",
        "snapshot_tag": None,
        "description": "Forrest Gump watching fMRI",
        "priority": 5
    },
    {
        "openneuro_id": "ds000114",
        "snapshot_tag": None,
        "description": "Test-retest fMRI motor, language and spatial attention tasks",
        "priority": 6
    },
    {
        "openneuro_id": "ds000117",
        "snapshot_tag": None,
        "description": "Multi-subject, multi-modal face processing",
        "priority": 7
    },
    {
        "openneuro_id": "ds000228",
        "snapshot_tag": None,
        "description": "Pediatric brain development",
        "priority": 8
    },
    {
        "openneuro_id": "ds000030",
        "snapshot_tag": None,
        "description": "UCLA Consortium for Neuropsychiatric Phenomics",
        "priority": 9
    },
    {
        "openneuro_id": "ds000171",
        "snapshot_tag": None,
        "description": "IXI - Normal aging brain MRI",
        "priority": 10
    }
]
