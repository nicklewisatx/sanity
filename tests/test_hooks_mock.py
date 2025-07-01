"""Mock tests for Claude Code TypeScript hooks using simulated behavior."""
import os
from pathlib import Path
import pytest
import subprocess


class TestHookMock:
    """Test Claude Code hooks using mock scripts for predictable behavior."""
    
    @pytest.fixture(autouse=True)
    def setup(self, project_root):
        """Set up test environment."""
        self.project_root = project_root
        self.mock_script = project_root / "tests" / "mock-pre-edit-check.sh"
        self.mock_script.chmod(0o755)
    
    def run_mock_hook(self, file_path: str) -> tuple[str, str, int]:
        """Run the mock hook script."""
        env = os.environ.copy()
        env['CLAUDE_FILE_PATH'] = file_path
        
        result = subprocess.run(
            [str(self.mock_script)],
            capture_output=True,
            text=True,
            env=env,
            cwd=str(self.project_root)
        )
        
        return result.stdout, result.stderr, result.returncode
    
    def test_security_blocks_outside_paths(self):
        """Test security validation."""
        stdout, stderr, code = self.run_mock_hook("/etc/passwd")
        assert "Security: File path outside project boundary" in stdout
        assert code == 1
    
    def test_prettier_formatting_detection(self):
        """Test Prettier formatting detection."""
        bad_format_path = str(self.project_root / "tests" / "fixtures" / "formatting_errors" / "bad-format.ts")
        stdout, stderr, code = self.run_mock_hook(bad_format_path)
        assert "🔧 Auto-formatting" in stdout
        assert code == 0
    
    def test_eslint_error_detection(self):
        """Test ESLint error detection."""
        lint_path = str(self.project_root / "tests" / "fixtures" / "lint_errors" / "unused-vars.ts")
        stdout, stderr, code = self.run_mock_hook(lint_path)
        assert "no-unused-vars" in stdout
        assert "'unusedVariable' is defined but never used" in stdout
        assert code == 1
    
    def test_clean_file_passes(self):
        """Test clean file passes all checks."""
        clean_path = str(self.project_root / "tests" / "fixtures" / "clean_project" / "good-code.ts")
        stdout, stderr, code = self.run_mock_hook(clean_path)
        assert stdout.strip() == ""  # No output for clean files
        assert code == 0