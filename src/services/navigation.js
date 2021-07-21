// Gets the next position of array after index that is true, or -1

export const getNextPos = (index, ar) => {
  for (let i = index + 1; i < ar.length; i += 1) {
    if (ar[i] === true) {
      return i;
    }
  }
  return -1;
};

export const getLastPos = (index, ar) => {
  if (index === 0) {
    return -1;
  }
  for (let i = index - 1; i >= 0; i -= 1) {
    if (ar[i] === true) {
      return i;
    }
  }
  return -1;
};
