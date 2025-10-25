#!/usr/bin/env python3
"""Test different OpenNeuro download URL patterns"""
import asyncio
import httpx

async def test_download_urls():
    client = httpx.AsyncClient(timeout=30.0, follow_redirects=True)

    dataset_id = "ds000224"
    snapshot_tag = "1.0.4"
    file_key = "ab706f4d310c46880cb4725cfd258169b277c8b6"
    file_id = "b46415a58c81eecef7f234c0b73010a7f2578261"

    # Try different URL patterns
    url_patterns = [
        f"https://openneuro.org/crn/datasets/{dataset_id}/snapshots/{snapshot_tag}/files/{file_key}",
        f"https://openneuro.org/crn/datasets/{dataset_id}/snapshots/{snapshot_tag}/files/{file_id}",
        f"https://openneuro.org/crn/datasets/{dataset_id}/files/{file_key}",
        f"https://openneuro.org/crn/datasets/{dataset_id}/files/{file_id}",
        f"https://openneuro.org/crn/datasets/{dataset_id}/download/{file_key}",
        f"https://s3.amazonaws.com/openneuro.org/{dataset_id}/{file_key}",
        f"https://openneuro.org/crn/datasets/{dataset_id}/files/{file_key}:HEAD",
        f"https://github.com/OpenNeuroDatasets/{dataset_id}/raw/main/participants.tsv",
    ]

    for i, url in enumerate(url_patterns, 1):
        print(f"\n[{i}/{len(url_patterns)}] Trying: {url}")
        try:
            response = await client.get(url)
            response.raise_for_status()
            content = response.content
            print(f"✅ SUCCESS! File size: {len(content)} bytes")
            print(f"First 300 chars:\n{content[:300].decode('utf-8')}")
            break
        except Exception as e:
            print(f"❌ Failed: {type(e).__name__}: {str(e)[:100]}")

    await client.aclose()

if __name__ == "__main__":
    asyncio.run(test_download_urls())
