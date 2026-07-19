/**
 * ============================================================================
 * GGP-OS SANDBOX DIRECTORY
 * ============================================================================
 * 
 * This directory contains ALL mock, demo, and test data that has been
 * PERMANENTLY SEPARATED from production code.
 * 
 * RULES:
 * 1. Production components (src/pages/, src/components/) must NEVER import
 *    from this directory.
 * 2. Any new mock data should be added to demo-data.ts in this directory.
 * 3. When live data sources are connected, the mock equivalent here can be
 *    used as a reference for expected data shapes.
 * 4. Demo mode pages (if built) can import from here.
 * 
 * FILE STRUCTURE:
 * - demo-data.ts — All hardcoded mock data arrays and constants
 * - README.md — This documentation file (you're reading it)
 * 
 * HISTORY:
 * - Created: July 19, 2026
 * - Reason: Full platform audit revealed 22 components with hardcoded mock
 *   data embedded directly in production code. All mock data has been
 *   extracted to this sandbox and replaced with empty states or live
 *   database queries in the production components.
 * ============================================================================
 */

export * from './demo-data';
