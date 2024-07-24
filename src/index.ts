// Tag declaration
export const TAG = '@xirelogy/xwts';

// Re-export from files
export * from './common';
export * from './sugar';
export * from './interfaces/XwErrorOptions';
export * from './interfaces/XwI18nDefinable';
export * from './interfaces/XwI18nInitializable';
export * from './interfaces/XwI18nModuleDefinable';
export * from './interfaces/XwLoggable';
export * from './interfaces/XwLoggerCreatable';
export * from './interfaces/XwPersistable';
export * from './interfaces/XwPublishable';
export * from './interfaces/XwReleasable';
export * from './interfaces/XwResolvable';
export * from './interfaces/XwStorageHandleable';
export * from './interfaces/XwSubscribable';
export * from './classes/XwCommonConditionalLoggerCreator';
export * from './classes/XwCommonRandomProvider';
export * from './classes/XwDummyLoggerCreator';
export * from './classes/XwDuplicatedError';
export * from './classes/XwError';
export * from './classes/XwEventBroker';
export * from './classes/XwGlobalCallback';
export * from './classes/XwMathRandomProvider';
export * from './classes/XwNotImplementedError';
export * from './classes/XwOneTimeRelease';
export * from './classes/XwOperationFailedError';
export * from './classes/XwPrefixedLoggerCreator';
export * from './classes/XwRandom';
export * from './classes/XwReleasableCollection';
export * from './classes/XwResolveUsing';
export * from './classes/XwTimeoutError';

// Main interface
export { default as xw } from './Xw';
