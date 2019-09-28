import { PrettyUserNamePipe } from './pretty-user-name.pipe';

describe('PrettyUserNamePipe', () => {
  it('create an instance', () => {
    const pipe = new PrettyUserNamePipe();
    expect(pipe).toBeTruthy();
  });
});
