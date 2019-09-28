import { ProfileRoutingModule } from './profile-routing.module';

describe('ProfileRoutingModule', () => {
  let profileRoutingModule: ProfileRoutingModule;

  beforeEach(() => {
    profileRoutingModule = new ProfileRoutingModule();
  });

  it('should create an instance', () => {
    expect(profileRoutingModule).toBeTruthy();
  });
});
