"""Integration tests for Claude Code TypeScript hooks."""
import os
import time
from pathlib import Path
import pytest
import subprocess


class TestHookIntegration:
    """Test Claude Code hooks using direct script execution."""
    
    @pytest.fixture(autouse=True)
    def setup(self, project_root):
        """Set up test environment."""
        self.project_root = project_root
        # Ensure scripts are executable
        scripts_dir = project_root / "scripts" / "claude-hooks"
        for script in scripts_dir.glob("*.sh"):
            script.chmod(0o755)
    
    def run_hook_script(self, script_name: str, file_path: str) -> tuple[str, str, int]:
        """
        Run a hook script directly with the given file path.
        
        Returns:
            Tuple of (stdout, stderr, return_code)
        """
        script_path = self.project_root / "scripts" / "claude-hooks" / script_name
        
        # Set environment variable that the hook expects
        env = os.environ.copy()
        env['CLAUDE_FILE_PATH'] = file_path
        
        # Run the script
        result = subprocess.run(
            [str(script_path)],
            capture_output=True,
            text=True,
            env=env,
            cwd=str(self.project_root)
        )
        
        return result.stdout, result.stderr, result.returncode
    
    @pytest.mark.integration
    def test_security_validation_blocks_outside_paths(self):
        """Test that the hook blocks file paths outside the project."""
        # Try to edit a file outside the project
        malicious_path = "/etc/passwd"
        
        stdout, stderr, code = self.run_hook_script("pre-edit-check.sh", malicious_path)
        
        assert "Security: File path outside project boundary" in stdout
        assert code == 1  # Should exit with error
    
    @pytest.mark.integration
    def test_security_validation_blocks_relative_escape(self):
        """Test that the hook blocks relative paths that escape the project."""
        # Try to use relative path to escape
        escape_path = str(self.project_root / ".." / ".." / ".." / "etc" / "passwd")
        
        stdout, stderr, code = self.run_hook_script("pre-edit-check.sh", escape_path)
        
        assert "Security: File path outside project boundary" in stdout
        assert code == 1
    
    @pytest.mark.integration
    def test_allows_valid_project_paths(self):
        """Test that valid project paths are allowed."""
        valid_path = str(self.project_root / "tests" / "fixtures" / "clean_project" / "good-code.ts")
        
        stdout, stderr, code = self.run_hook_script("pre-edit-check.sh", valid_path)
        
        # Should not have security error
        assert "Security:" not in stdout
        # Return code should be 0 for success or related to formatting/linting
        assert code in [0, 1]  # 0 = success, 1 = lint/format issues
    
    @pytest.mark.integration
    def test_ignores_non_typescript_files(self):
        """Test that non-TypeScript/JavaScript files are ignored."""
        non_ts_path = str(self.project_root / "README.md")
        
        stdout, stderr, code = self.run_hook_script("pre-edit-check.sh", non_ts_path)
        
        # Should exit immediately with success
        assert code == 0
        assert stdout == ""  # No output for non-TS files
    
    @pytest.mark.integration
    def test_prettier_formatting_detection(self):
        """Test that Prettier detects formatting issues."""
        bad_format_path = str(self.project_root / "tests" / "fixtures" / "formatting_errors" / "bad-format.ts")
        
        stdout, stderr, code = self.run_hook_script("pre-edit-check.sh", bad_format_path)
        
        # Should detect formatting issues and attempt to fix
        assert "🔧 Auto-formatting" in stdout or "error" in stdout
    
    @pytest.mark.integration 
    def test_eslint_catches_unused_variables(self):
        """Test that ESLint catches unused variable violations."""
        lint_error_path = str(self.project_root / "tests" / "fixtures" / "lint_errors" / "unused-vars.ts")
        
        stdout, stderr, code = self.run_hook_script("pre-edit-check.sh", lint_error_path)
        
        # Should report ESLint errors
        assert "no-unused-vars" in stdout or "error" in stdout
    
    @pytest.mark.integration
    def test_clean_file_passes_all_checks(self):
        """Test that a clean file passes all checks."""
        clean_path = str(self.project_root / "tests" / "fixtures" / "clean_project" / "good-code.ts")
        
        stdout, stderr, code = self.run_hook_script("pre-edit-check.sh", clean_path)
        
        # Should not have any errors
        assert "Security:" not in stdout
        assert "error" not in stdout.lower()
        # May have warnings but no errors
        assert code in [0, 1]
    
    @pytest.mark.integration
    def test_timeout_protection(self):
        """Test that the hook times out after 2 seconds."""
        # This test is tricky to implement without modifying the script
        # We'll test that the timeout command is in the script
        script_path = self.project_root / "scripts" / "claude-hooks" / "pre-edit-check.sh"
        
        with open(script_path, 'r') as f:
            script_content = f.read()
        
        assert "timeout 2s" in script_content
        assert "Checks timed out - proceeding anyway" in script_content
    
    @pytest.mark.integration
    def test_workspace_detection_web_app(self):
        """Test workspace detection for web app files."""
        # Create a temporary file in the web app directory
        web_file = self.project_root / "apps" / "web" / "test-temp.ts"
        web_file.write_text("const test = 'web app';")
        
        try:
            stdout, stderr, code = self.run_hook_script("pre-edit-check.sh", str(web_file))
            
            # The script should detect this as @sanity/web workspace
            # We can't directly test the WORKSPACE variable, but we can see if it runs
            assert code in [0, 1]  # Should run without crashing
        finally:
            # Clean up
            if web_file.exists():
                web_file.unlink()
    
    @pytest.mark.integration
    def test_post_edit_logging(self):
        """Test that post-edit hook logs completion."""
        test_path = str(self.project_root / "tests" / "fixtures" / "clean_project" / "good-code.ts")
        
        # Set the environment variable
        env = os.environ.copy()
        env['CLAUDE_FILE_PATH'] = test_path
        
        # Run post-edit script
        result = subprocess.run(
            [str(self.project_root / "scripts" / "claude-hooks" / "post-edit-log.sh")],
            capture_output=True,
            text=True,
            env=env
        )
        
        assert f"✓ Edit completed for {test_path}" in result.stdout
        assert result.returncode == 0


class TestHookPerformance:
    """Test performance characteristics of the hooks."""
    
    @pytest.fixture(autouse=True)
    def setup(self, project_root):
        """Set up test environment."""
        self.project_root = project_root
    
    @pytest.mark.integration
    def test_hook_completes_under_timeout(self):
        """Test that hooks complete within the 2-second timeout."""
        script_path = self.project_root / "scripts" / "claude-hooks" / "pre-edit-check.sh"
        test_file = str(self.project_root / "tests" / "fixtures" / "clean_project" / "good-code.ts")
        
        env = os.environ.copy()
        env['CLAUDE_FILE_PATH'] = test_file
        
        start_time = time.time()
        
        result = subprocess.run(
            [str(script_path)],
            capture_output=True,
            text=True,
            env=env,
            cwd=str(self.project_root)
        )
        
        duration = time.time() - start_time
        
        # Should complete well under 2 seconds for a normal file
        assert duration < 2.0, f"Hook took {duration}s, exceeding timeout"
        
        # Should not show timeout message for normal files
        assert "Checks timed out" not in result.stdout