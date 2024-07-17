const SingletonStorage = (function () {
  const STORAGE_KEY = '$__xw_global__$';
  const ACCESS_KEY = '$__access__$';


  // Actual object storage
  var o = {
    _v: Date.now(),
  };


  // Container object (to hide objects)
  const h = {
    access: (key) => {
      return key === ACCESS_KEY ? o : {};
    }
  };

  // Return structure
  return {
    getInstance: () => {
      if (typeof window[STORAGE_KEY] === 'undefined') {
        window[STORAGE_KEY] = h;
      }

      return window[STORAGE_KEY].access(ACCESS_KEY);
    }
  }
})();


/**
 * Access to item stored in global storage
 * @param {string} namespace Storage namespace
 * @param {function(): object} prototypeFn Prototype function to create new item if not yet exist
 * @returns {object} The corresponding stored item
 */
export function jsGlobalStoreAccess(namespace, prototypeFn) {
  const store = SingletonStorage.getInstance();
  if (typeof store[namespace] == 'undefined') {
    store[namespace] = prototypeFn();
  }

  return store[namespace];
}