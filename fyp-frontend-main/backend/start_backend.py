#!/usr/bin/env python3
"""
Startup script for MapMate Backend
"""

import uvicorn
import os
from pathlib import Path

def main():
    """Start the FastAPI backend server"""
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print("🚀 Starting MapMate Backend...")
    print(f"📁 Working directory: {backend_dir}")
    
    # Check if required files exist
    required_files = [
        "main.py",
        "Library/LC_Lib.py",
        "Library/keypoints_3d.npy",
        "Library/descriptors_3d.npy",
        "maps/campus_graph.json",
        "transform_library.json"
    ]

    optional_files = [
        "maps/giki_graph.json",
    ]
    
    missing_files = []
    for file_path in required_files:
        if not (backend_dir / file_path).exists():
            missing_files.append(file_path)

    for file_path in optional_files:
        if not (backend_dir / file_path).exists():
            print(f"⚠️ Optional file missing: {file_path}")
    
    if missing_files:
        print("❌ Missing required files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        return
    
    print("✅ All required files found")
    
    # Start the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )

if __name__ == "__main__":
    main()
