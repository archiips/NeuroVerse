"""OpenNeuro GraphQL API client service"""
import httpx
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class OpenNeuroService:
    """Client for interacting with OpenNeuro GraphQL API"""

    GRAPHQL_ENDPOINT = "https://openneuro.org/crn/graphql"

    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0, follow_redirects=True)

    async def get_dataset_info(self, dataset_id: str, snapshot_tag: Optional[str] = None) -> Dict:
        """
        Fetch dataset metadata from OpenNeuro

        Args:
            dataset_id: OpenNeuro dataset ID (e.g., "ds000224")
            snapshot_tag: Specific snapshot version (e.g., "1.0.1"), defaults to latest

        Returns:
            Dictionary with dataset metadata
        """
        if snapshot_tag:
            query = """
            query GetDatasetSnapshot($datasetId: ID!, $tag: String!) {
              snapshot(datasetId: $datasetId, tag: $tag) {
                id
                tag
                description {
                  Name
                  DatasetDOI
                }
              }
            }
            """
            variables = {"datasetId": dataset_id, "tag": snapshot_tag}
        else:
            query = """
            query GetDataset($id: ID!) {
              dataset(id: $id) {
                id
                name
                latestSnapshot {
                  tag
                  description {
                    Name
                    DatasetDOI
                  }
                }
              }
            }
            """
            variables = {"id": dataset_id}

        response = await self.client.post(
            self.GRAPHQL_ENDPOINT,
            json={"query": query, "variables": variables}
        )
        response.raise_for_status()
        return response.json()

    async def get_file_tree(self, dataset_id: str, snapshot_tag: str, tree_id: Optional[str] = None) -> List[Dict]:
        """
        Fetch file tree for a dataset snapshot

        Args:
            dataset_id: OpenNeuro dataset ID
            snapshot_tag: Snapshot version
            tree_id: Optional tree ID for subdirectories

        Returns:
            List of files/directories
        """
        if tree_id:
            query = """
            query GetFiles($datasetId: ID!, $tag: String!, $tree: String!) {
              snapshot(datasetId: $datasetId, tag: $tag) {
                files(tree: $tree) {
                  id
                  key
                  filename
                  size
                  directory
                  annexed
                }
              }
            }
            """
            variables = {"datasetId": dataset_id, "tag": snapshot_tag, "tree": tree_id}
        else:
            query = """
            query GetFiles($datasetId: ID!, $tag: String!) {
              snapshot(datasetId: $datasetId, tag: $tag) {
                files {
                  id
                  key
                  filename
                  size
                  directory
                  annexed
                }
              }
            }
            """
            variables = {"datasetId": dataset_id, "tag": snapshot_tag}

        response = await self.client.post(
            self.GRAPHQL_ENDPOINT,
            json={"query": query, "variables": variables}
        )
        response.raise_for_status()
        data = response.json()
        return data["data"]["snapshot"]["files"]

    async def find_participants_file(self, dataset_id: str, snapshot_tag: str) -> Optional[str]:
        """
        Find the participants.tsv file in the dataset

        Returns:
            File key for participants.tsv or None if not found
        """
        files = await self.get_file_tree(dataset_id, snapshot_tag)

        for file in files:
            if file["filename"] == "participants.tsv" and not file["directory"]:
                return file["key"]

        return None

    async def download_participants_file(self, dataset_id: str, snapshot_tag: str, file_key: str) -> bytes:
        """
        Download participants.tsv file content from GitHub mirror

        Args:
            dataset_id: OpenNeuro dataset ID
            snapshot_tag: Snapshot version (not used, kept for compatibility)
            file_key: File key from file tree (not used, kept for compatibility)

        Returns:
            File content as bytes
        """
        # OpenNeuro datasets are mirrored on GitHub
        # Try both 'main' and 'master' branches as different repos use different default branches
        branches = ['main', 'master']

        for branch in branches:
            download_url = f"https://github.com/OpenNeuroDatasets/{dataset_id}/raw/{branch}/participants.tsv"

            try:
                logger.info(f"Trying to download from GitHub ({branch} branch): {download_url}")
                response = await self.client.get(download_url)
                response.raise_for_status()
                logger.info(f"✅ Successfully downloaded from {branch} branch")
                return response.content
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    logger.debug(f"Not found on {branch} branch, trying next...")
                    continue
                else:
                    raise

        # If we get here, neither branch worked
        raise Exception(f"participants.tsv not found in GitHub repo (tried 'main' and 'master' branches)")

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
