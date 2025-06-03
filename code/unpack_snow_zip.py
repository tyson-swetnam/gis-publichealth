#!/usr/bin/env python3
"""
Download and unpack the snow dataset from GeoDa Center.
"""

import os
import sys
import requests
import zipfile

# Configuration
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
DATA_DIR = os.path.join(REPO_ROOT, 'data')
ZIP_URL = 'https://geodacenter.github.io/data-and-lab/data/snow.zip'
ZIP_FILENAME = 'snow.zip'
ZIP_PATH = os.path.join(DATA_DIR, ZIP_FILENAME)


def ensure_data_dir():
    """Ensure that the data directory exists."""
    os.makedirs(DATA_DIR, exist_ok=True)


def download_zip(url=ZIP_URL, dest_path=ZIP_PATH):
    """Download the zip file from the specified URL to dest_path."""
    print(f'Downloading {url} to {dest_path}...')
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(dest_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print('Download complete.')


def unpack_zip(zip_path=ZIP_PATH, extract_to=DATA_DIR):
    """Unpack the zip file into the data directory."""
    print(f'Unpacking {zip_path} to {extract_to}...')
    with zipfile.ZipFile(zip_path, 'r') as archive:
        archive.extractall(extract_to)
    print('Unpack complete.')


def remove_zip(zip_path=ZIP_PATH):
    """Delete the zip file after unpacking."""
    print(f'Removing zip file {zip_path}...')
    try:
        os.remove(zip_path)
        print('Zip file removed.')
    except OSError as e:
        print(f'Could not remove zip file: {e}', file=sys.stderr)


def main():
    try:
        ensure_data_dir()
        download_zip()
        unpack_zip()
        remove_zip()
    except Exception as err:
        print(f'Error: {err}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
