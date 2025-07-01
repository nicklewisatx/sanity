"""Test harness and fixtures for Claude Code hook testing."""
import asyncio
import os
from pathlib import Path
import pytest


@pytest.fixture
def project_root():
    """Get the project root directory."""
    return Path(__file__).parent.parent


# Pytest configuration
def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line("markers", "integration: mark test as integration test")
    config.addinivalue_line("markers", "unit: mark test as unit test")


# Async test support
@pytest.fixture
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()