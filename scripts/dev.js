#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Caption AI development servers...\n');

// Start the main process in watch mode
const mainProcess = spawn('yarn', ['workspace', '@caption-ai/main', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

// Start the renderer process
const rendererProcess = spawn('yarn', ['workspace', '@caption-ai/renderer', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

// Start the preload process in watch mode
const preloadProcess = spawn('yarn', ['workspace', '@caption-ai/preload', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  mainProcess.kill('SIGINT');
  rendererProcess.kill('SIGINT');
  preloadProcess.kill('SIGINT');
  process.exit(0);
});

// Handle process errors
mainProcess.on('error', (err) => {
  console.error('Main process error:', err);
});

rendererProcess.on('error', (err) => {
  console.error('Renderer process error:', err);
});

preloadProcess.on('error', (err) => {
  console.error('Preload process error:', err);
});