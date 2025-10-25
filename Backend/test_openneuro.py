#!/usr/bin/env python3
"""
Test script to debug OpenNeuro API responses
"""
import asyncio
import httpx
import json

async def test_openneuro_api():
    """Test OpenNeuro GraphQL API"""

    client = httpx.AsyncClient(timeout=30.0)

    # Test 1: Get dataset info for ds000224
    print("=" * 60)
    print("TEST 1: Fetching dataset info for ds000224")
    print("=" * 60)

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

    variables = {"id": "ds000224"}

    try:
        response = await client.post(
            "https://openneuro.org/crn/graphql",
            json={"query": query, "variables": variables}
        )
        response.raise_for_status()
        data = response.json()
        print("✅ Dataset info response:")
        print(json.dumps(data, indent=2))

        # Extract snapshot tag
        if "data" in data and "dataset" in data["data"]:
            dataset = data["data"]["dataset"]
            if dataset and "latestSnapshot" in dataset and dataset["latestSnapshot"]:
                snapshot_tag = dataset["latestSnapshot"]["tag"]
                print(f"\n📌 Latest snapshot tag: {snapshot_tag}")

                # Test 2: Get file tree
                print("\n" + "=" * 60)
                print(f"TEST 2: Fetching file tree for ds000224 (tag: {snapshot_tag})")
                print("=" * 60)

                files_query = """
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

                files_variables = {"datasetId": "ds000224", "tag": snapshot_tag}

                files_response = await client.post(
                    "https://openneuro.org/crn/graphql",
                    json={"query": files_query, "variables": files_variables}
                )
                files_response.raise_for_status()
                files_data = files_response.json()

                print("✅ File tree response:")
                print(json.dumps(files_data, indent=2)[:1000] + "...")

                # Find participants.tsv
                if "data" in files_data and "snapshot" in files_data["data"]:
                    files = files_data["data"]["snapshot"]["files"]
                    participants_file = None

                    for file in files:
                        if file["filename"] == "participants.tsv" and not file["directory"]:
                            participants_file = file
                            break

                    if participants_file:
                        print(f"\n✅ Found participants.tsv:")
                        print(json.dumps(participants_file, indent=2))

                        # Test 3: Try to download the file
                        print("\n" + "=" * 60)
                        print("TEST 3: Attempting to download participants.tsv")
                        print("=" * 60)

                        file_key = participants_file["key"]
                        download_url = f"https://openneuro.org/crn/datasets/ds000224/snapshots/{snapshot_tag}/files/{file_key}"

                        print(f"Download URL: {download_url}")

                        try:
                            download_response = await client.get(download_url)
                            download_response.raise_for_status()
                            content = download_response.content
                            print(f"✅ Download successful! File size: {len(content)} bytes")
                            print(f"\nFirst 500 characters:")
                            print(content[:500].decode('utf-8'))
                        except Exception as download_error:
                            print(f"❌ Download failed: {download_error}")

                            # Try alternative download method
                            print("\n" + "=" * 60)
                            print("TEST 4: Trying alternative download URL")
                            print("=" * 60)

                            alt_url = f"https://openneuro.org/crn/datasets/ds000224/files/{file_key}:HEAD"
                            print(f"Alternative URL: {alt_url}")

                            try:
                                alt_response = await client.get(alt_url)
                                alt_response.raise_for_status()
                                alt_content = alt_response.content
                                print(f"✅ Alternative download successful! File size: {len(alt_content)} bytes")
                                print(f"\nFirst 500 characters:")
                                print(alt_content[:500].decode('utf-8'))
                            except Exception as alt_error:
                                print(f"❌ Alternative download also failed: {alt_error}")
                    else:
                        print("❌ participants.tsv not found in file tree")
            else:
                print("❌ No latestSnapshot found")
        else:
            print("❌ Unexpected response structure")

    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        await client.aclose()

if __name__ == "__main__":
    asyncio.run(test_openneuro_api())
