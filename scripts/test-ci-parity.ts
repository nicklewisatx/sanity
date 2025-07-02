#!/usr/bin/env node
import { assertCIParity } from '../packages/test-utils/src/ci/index'
import { resolve } from 'path'

console.log('🔍 Checking CI/CD parity...\n')

try {
  // Run parity check from project root
  const projectRoot = resolve(process.cwd())
  assertCIParity(projectRoot)
  
  console.log('✅ CI parity check passed!\n')
  console.log('Your local environment matches CI requirements.')
  process.exit(0)
} catch (error) {
  console.error('\n❌ CI parity check failed!\n')
  
  if (error instanceof Error) {
    console.error(error.message)
  }
  
  console.error('\nPlease fix the issues above before running tests.')
  console.error('This ensures your local tests will match CI behavior.\n')
  
  process.exit(1)
}