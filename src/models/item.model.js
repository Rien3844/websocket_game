const items = {};

export const createItem = (uuid) => {
  items[uuid] = []; 
};

export const getItem = (uuid) => {
  return items[uuid];
};

export const setItem = (uuid, item, timestamp) => {
  return items[uuid].push({ item, timestamp });
};
