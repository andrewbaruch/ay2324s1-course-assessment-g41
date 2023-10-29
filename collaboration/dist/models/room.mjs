import { createRequire as topLevelCreateRequire } from 'module';
global.require = topLevelCreateRequire(import.meta.url);
