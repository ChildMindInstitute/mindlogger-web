import userReducer, { initialState } from './user.reducer';

test('it has an initial state', () => {
  expect(userReducer(undefined, { type: 'foo' })).toEqual(initialState);
});
